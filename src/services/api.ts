import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Task, TodoGroup, User, ChatMessage, AuthResponse } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export { api };

// Auth endpoints
export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/users/login', { email, password });

export const register = (email: string, password: string, displayName: string) =>
  api.post<AuthResponse>('/users/register', { email, password, displayName });

// Task endpoints
export const getTasks = (groupId?: string) =>
  api.get<Task[]>('/tasks', { params: { groupId } });

export const createTask = (formData: FormData) =>
  api.post<Task>('/tasks', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateTask = (taskId: string, formData: FormData) =>
  api.put<Task>(`/tasks/${taskId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteTask = (taskId: string) =>
  api.delete(`/tasks/${taskId}`);

// Group endpoints
export const getGroups = () =>
  api.get<TodoGroup[]>('/groups');

export const getAllGroups = () =>
  api.get<TodoGroup[]>('/groups/all');

export const createGroup = (data: Partial<TodoGroup>) =>
  api.post<TodoGroup>('/groups', data);

export const updateGroup = (groupId: string, data: Partial<TodoGroup>) =>
  api.put<TodoGroup>(`/groups/${groupId}`, data);

export const deleteGroup = (groupId: string) =>
  api.delete(`/groups/${groupId}`);

export const joinGroup = (groupId: string) =>
  api.post<TodoGroup>(`/groups/${groupId}/join`);

export const leaveGroup = (groupId: string) =>
  api.post<{ message: string }>(`/groups/${groupId}/leave`);

export const updateGroupMembers = (groupId: string, memberIds: string[]) =>
  api.put<TodoGroup>(`/groups/${groupId}/members`, { memberIds });

// Chat endpoints
export const getMessages = (groupId: string) =>
  api.get<ChatMessage[]>(`/chat/${groupId}/messages`);

export const sendMessage = (groupId: string, content: string) =>
  api.post<ChatMessage>(`/chat/${groupId}/messages`, { content });

// User endpoints
export const searchUsers = (query: string) =>
  api.get<User[]>('/users/search', { params: { q: query } });

export const getUserProfile = () =>
  api.get<User>('/users/profile');

export const updateUserProfile = (data: Partial<User>) =>
  api.put<User>('/users/profile', data);
