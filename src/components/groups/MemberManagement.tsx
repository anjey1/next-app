import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';

interface User {
  _id: string;
  displayName: string;
  email: string;
}

interface MemberManagementProps {
  groupId: string;
  onUpdate: () => void;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({ groupId, onUpdate }) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users } = useQuery({
    queryKey: ['users', searchTerm],
    queryFn: () => api.get(`/users/search?q=${searchTerm}`).then(res => res.data),
    enabled: searchTerm.length > 2
  });

  const { data: currentMembers } = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => api.get(`/groups/${groupId}/members`).then(res => res.data)
  });

  useEffect(() => {
    if (currentMembers) {
      setSelectedUsers(currentMembers.map((member: User) => member._id));
    }
  }, [currentMembers]);

  const handleUpdateMembers = async () => {
    try {
      await api.put(`/groups/${groupId}/members`, { memberIds: selectedUsers });
      onUpdate();
    } catch (error) {
      console.error('Failed to update members:', error);
    }
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
        {users?.map((user: User) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-3 hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{user.displayName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <input
              type="checkbox"
              checked={selectedUsers.includes(user._id)}
              onChange={() => toggleUser(user._id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleUpdateMembers}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Update Members
      </button>
    </div>
  );
};