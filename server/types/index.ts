import { Request } from 'express';
import { Document } from 'mongoose';
import { User } from '../../src/types';

export interface UserDocument extends Document {
  _id: string;
  email: string;
  displayName: string;
  password: string;
  avatarUrl?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface AuthRequest extends Request {
  user?: UserDocument;
}

export interface TaskDocument extends Document {
  title: string;
  imageUrl?: string;
  status: 'todo' | 'done';
  groupId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupDocument extends Document {
  name: string;
  description?: string;
  visibility: 'public' | 'private';
  status: 'todo' | 'done';
  owner: string;
  members: User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessageDocument extends Document {
  groupId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface JwtPayload {
  id: string;
  isAdmin: boolean;
}