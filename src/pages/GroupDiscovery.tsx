import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { useAuthStore } from '../store/authStore';

export const GroupDiscovery: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups', 'public'],
    queryFn: api.getGroups
  });

  const joinGroupMutation = useMutation({
    mutationFn: api.joinGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const publicGroups = groups?.filter(group => group.visibility === 'public') || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Discover Groups</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicGroups.map((group) => (
          <div key={group._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
            <p className="text-gray-600 mb-4">{group.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {Array.isArray(group.members) ? group.members.length : 0} members
              </span>
              {!group.members.includes(user?._id || '') && (
                <button
                  onClick={() => joinGroupMutation.mutate(group._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={joinGroupMutation.isPending}
                >
                  {joinGroupMutation.isPending ? 'Joining...' : 'Join Group'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};