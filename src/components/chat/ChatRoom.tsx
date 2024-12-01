import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ChatMessage, User } from '../../types';
import { socketService } from '../../services/socket';
import { useStore } from '../../store/useStore';

interface ChatRoomProps {
  groupId: string;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ groupId, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = useStore(state => state.users);
  const users = useStore(state => state.users);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socketService.joinRoom(groupId);
    return () => {
      socketService.leaveRoom(groupId);
    };
  }, [groupId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && currentUser) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const getUserInfo = (userId: string): User | undefined => {
    return users.find(user => user._id === userId);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const user = getUserInfo(message.userId);
          const isCurrentUser = currentUser?.id === message.userId;

          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">{user?.displayName || 'Unknown User'}</span>
                  <span className="text-xs opacity-70">
                    {format(new Date(message.createdAt), 'HH:mm')}
                  </span>
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          );
        })}
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