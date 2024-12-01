import mongoose, { Schema } from 'mongoose';
import { TaskDocument } from '../types';

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ['todo', 'done'],
    default: 'todo'
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TodoGroup',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<TaskDocument>('Task', taskSchema);