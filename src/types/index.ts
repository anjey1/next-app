export interface User {
  _id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  _id: string;
  title: string;
  imageUrl?: string;
  status: 'todo' | 'done';
  groupId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoGroup {
  _id: string;
  name: string;
  description?: string;
  status: 'todo' | 'done';
  visibility: 'public' | 'private';
  owner: string | User;
  members: string[] | User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  _id: string;
  groupId: string;
  userId: User;
  content: string;
  createdAt: Date;
}

export interface AuthResponse {
  _id: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  token: string;
}