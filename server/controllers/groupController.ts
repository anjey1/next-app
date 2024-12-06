import { Response } from 'express';
import { AuthRequest } from '../types';
import TodoGroup from '../models/TodoGroup';
import Task from '../models/Task';

export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, visibility } = req.body;

    const group = await TodoGroup.create({
      name,
      description,
      visibility,
      owner: req.user!._id,
      members: [req.user!._id],
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const getGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const groups = await TodoGroup.find({
      $or: [
        { visibility: 'public' },
        { members: req.user!._id }
      ]
    })
      .populate('owner', 'displayName email')
      .populate('members', 'displayName email')
      .sort({ updatedAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const updateGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const group = await TodoGroup.findById(req.params.id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    if (req.user!._id && (group.owner.toString() !== req.user!._id as string)) {
      res.status(403).json({ message: 'Not authorized to update this group' });
      return;
    }

    const updatedGroup = await TodoGroup.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const deleteGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const group = await TodoGroup.findById(req.params.id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    if ((req.user!._id) && group.owner.toString() !== req.user!._id.toString() && !req.user!.isAdmin) {
      res.status(403).json({ message: 'Not authorized to delete this group' });
      return;
    }

    await Task.deleteMany({ groupId: group?._id?.toString() });
    await group.deleteOne();

    res.json({ message: 'Group removed' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const joinGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const group = await TodoGroup.findById(req.params.id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    if (group.visibility !== 'public') {
      res.status(403).json({ message: 'This group is private' });
      return;
    }

    if (group.members.some(member => member._id === req.user!._id)) {
      res.status(400).json({ message: 'Already a member of this group' });
      return;
    }

    group.members.push(req.user!);
    await group.save();

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const leaveGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const group = await TodoGroup.findById(req.params.id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    if ((req.user!._id) && group.owner.toString() === req.user!._id.toString()) {
      res.status(400).json({ message: 'Group owner cannot leave the group' });
      return;
    }

    if (req.user!._id) {
      group.members = group.members.filter(
        (memberId) => memberId.toString() !== req.user!._id.toString()
      );
    }

    await group.save();
    res.json({ message: 'Left group successfully' });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

// Admin-only controllers
export const getAllGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {

    console.log(req)
    const groups = await TodoGroup.find()
      .populate('owner', 'displayName email')
      .populate('members', 'displayName email')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const updateGroupMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { groupId } = req.params;
    const { memberIds } = req.body;

    const group = await TodoGroup.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    group.members = memberIds;
    await group.save();

    const updatedGroup = await group.populate('members', 'displayName email');
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};



export const getGroupMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { groupId } = req.params;

    const group = await TodoGroup.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    const groupMembers = await group.populate('members', 'displayName email');
    res.json(groupMembers);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }

}


export const searchGroupMembers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { groupId } = req.params;
    const { q } = req.query;

    const group = await TodoGroup.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    // Example with MongoDB:
    // Use a regular expression to perform a case-insensitive match
    const users = group.members.filter(member => new RegExp(q as string, 'i').test(member.displayName));

    //const groupMembers = await group.populate('members', 'displayName email');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }

}