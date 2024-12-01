import { Response } from 'express';
import { AuthRequest } from '../types';
import Task from '../models/Task';
import TodoGroup from '../models/TodoGroup';

export const createTask = async (req: AuthRequest, res: Response) => {

  try {
    const { title, groupId = '6748a255440c6330ab7482ec' } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = req.file.filename ? `/uploads/${req.file.filename}` : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtmtWSR1nXyIhwH62LZVOfE4xduJYumb3Va11zXY90Aw_pC4AoRlKGwy_69ldC3uTF_qo';

    const group = await TodoGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (!group.members.includes(req.user!._id as string) && !req.user!.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to add tasks to this group' });
    }

    const task = await Task.create({
      title,
      imageUrl,
      groupId,
      createdBy: req.user!._id,
    });

    const populatedTask = await task.populate('createdBy', 'displayName email');
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.query;
    const filter = groupId ? { groupId } : {};

    const tasks = await Task.find(filter)
      .populate('createdBy', 'displayName email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const group = await TodoGroup.findById(task.groupId);
    if (!group!.members.includes(req.user!._id as string) && !req.user!.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    ).populate('createdBy', 'displayName email');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const group = await TodoGroup.findById(task.groupId);
    if (!group!.members.includes(req.user!._id as string) && !req.user!.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};