import { io } from 'socket.io-client';
import { ChatMessage } from '../types';

const SOCKET_URL = 'http://localhost:3001'; // Replace with your actual socket server URL

export const socket = io(SOCKET_URL);

export const socketService = {
  joinRoom: (groupId: string) => {
    socket.emit('join_room', groupId);
  },

  leaveRoom: (groupId: string) => {
    socket.emit('leave_room', groupId);
  },

  sendMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    socket.emit('send_message', message);
  },

  onMessage: (callback: (message: ChatMessage) => void) => {
    socket.on('new_message', callback);
  },

  disconnect: () => {
    socket.disconnect();
  }
};