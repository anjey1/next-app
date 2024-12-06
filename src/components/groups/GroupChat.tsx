import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';
import { socketService } from '../../services/socket';

interface Message {
  _id: string;
  groupId: string;
  content: string;
  userId: {
    _id: string;
    displayName: string;
  };
  createdAt: string;
}

interface GroupChatProps {
  groupId: string;
  messages: Message[];
}

export const GroupChat: React.FC<GroupChatProps> = ({ groupId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/${groupId}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();
    socketService.joinRoom(groupId);

    const handleNewMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    socketService.onMessage(handleNewMessage);

    return () => {
      socketService.leaveRoom(groupId);
    };
  }, [groupId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await api.post(`/chat/${groupId}/messages`, { content: newMessage.trim() });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${message.userId._id === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.userId._id === user?._id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium">{message.userId.displayName}</span>
                <span className="text-xs opacity-70">
                  {format(new Date(message.createdAt), 'HH:mm')}
                </span>
              </div>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};