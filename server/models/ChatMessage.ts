import mongoose, { Schema } from 'mongoose';
import { ChatMessageDocument } from '../types';

const chatMessageSchema = new Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TodoGroup',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ChatMessageDocument>('ChatMessage', chatMessageSchema);