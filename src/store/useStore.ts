import { create } from 'zustand';
import { Task, TodoGroup, User, ChatMessage } from '../types';
import * as api from '../services/api';

interface Store {
  tasks: Task[];
  groups: TodoGroup[];
  users: User[];
  messages: Record<string, ChatMessage[]>;
  setTasks: (tasks: Task[]) => void;
  setGroups: (groups: TodoGroup[]) => void;
  setUsers: (users: User[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addGroup: (group: TodoGroup) => void;
  updateGroup: (groupId: string, updates: Partial<TodoGroup>) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  addMessage: (groupId: string, message: ChatMessage) => void;
  setMessages: (groupId: string, messages: ChatMessage[]) => void;
  fetchMessages: (groupId: string) => Promise<void>;
  sendMessage: (groupId: string, content: string) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  tasks: [],
  groups: [],
  users: [],
  messages: {},

  setTasks: (tasks) => set({ tasks }),
  setGroups: (groups) => set({ groups }),
  setUsers: (users) => set({ users }),

  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: async (taskId, updates) => {
    const response = await api.updateTask(taskId, updates);
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === taskId ? response.data : task
      ),
    }));
  },

  deleteTask: async (taskId) => {
    await api.deleteTask(taskId);
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== taskId),
    }));
  },

  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),

  updateGroup: async (groupId, updates) => {
    const response = await api.updateGroup(groupId, updates);
    set((state) => ({
      groups: state.groups.map((group) =>
        group._id === groupId ? response.data : group
      ),
    }));
  },

  deleteGroup: async (groupId) => {
    await api.deleteGroup(groupId);
    set((state) => ({
      groups: state.groups.filter((group) => group._id !== groupId),
    }));
  },

  joinGroup: async (groupId) => {
    const response = await api.joinGroup(groupId);
    set((state) => ({
      groups: state.groups.map((group) =>
        group._id === groupId ? response.data : group
      ),
    }));
  },

  leaveGroup: async (groupId) => {
    await api.leaveGroup(groupId);
    set((state) => ({
      groups: state.groups.filter((group) => group._id !== groupId),
    }));
  },

  addMessage: (groupId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [groupId]: [...(state.messages[groupId] || []), message],
      },
    })),

  setMessages: (groupId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [groupId]: messages,
      },
    })),

  fetchMessages: async (groupId) => {
    const response = await api.getMessages(groupId);
    set((state) => ({
      messages: {
        ...state.messages,
        [groupId]: response.data,
      },
    }));
  },

  sendMessage: async (groupId, content) => {
    const response = await api.sendMessage(groupId, content);
    set((state) => ({
      messages: {
        ...state.messages,
        [groupId]: [...(state.messages[groupId] || []), response.data],
      },
    }));
  },
}));