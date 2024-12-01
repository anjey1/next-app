import { Response } from 'express';
import { AuthRequest } from '../types';
import ChatMessage from '../models/ChatMessage';
import TodoGroup from '../models/TodoGroup';

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { groupId } = req.params;
    const group = await TodoGroup.findById(groupId);
    
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    if (!group.members.includes(req.user!._id as string)) {
      res.status(403).json({ message: 'Not authorized to view messages' });
      return;
    }

    const messages = await ChatMessage.find({ groupId })
      .populate('userId', 'displayName email')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;

    const group = await TodoGroup.findById(groupId);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }

    if (!group.members.includes(req.user!._id as string)) {
      res.status(403).json({ message: 'Not authorized to send messages' });
      return;
    }

    const message = await ChatMessage.create({
      groupId,
      userId: req.user!._id,
      content,
    });

    const populatedMessage = await message.populate('userId', 'displayName email');
    
    // Emit the message through Socket.IO
    req.app.get('io').to(groupId).emit('new_message', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
  }
};