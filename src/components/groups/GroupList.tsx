import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../services/api';

interface Group {
  _id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  members: string[];
  owner: string;
}

interface GroupListProps {
  groups: Group[];
  isAdmin?: boolean;
  onGroupUpdated: () => void;
}

export const GroupList: React.FC<GroupListProps> = ({ groups, isAdmin, onGroupUpdated }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await api.delete(`/groups/${groupId}`);
      onGroupUpdated();
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleManageMembers = (groupId: string) => {
    navigate(`/groups/${groupId}/members`);
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <div key={group._id} className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
          <p className="text-gray-600 mb-4">{group.description}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{group.visibility}</span>
            <span>{group.members.length} members</span>
          </div>
          {isAdmin && (
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleManageMembers(group._id)}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                Manage Members
              </button>
              <button
                onClick={() => handleDeleteGroup(group._id)}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};