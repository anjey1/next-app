import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GroupList } from '../components/groups/GroupList';
import { CreateGroupForm } from '../components/groups/CreateGroupForm';
import * as api from '../services/api';
import { TodoGroup } from '../types';

export const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups', 'admin'],
    queryFn: api.getAllGroups
  });

  const createGroupMutation = useMutation({
    mutationFn: (data: Partial<TodoGroup>) => api.createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: api.deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    }
  });

  const updateMembersMutation = useMutation({
    mutationFn: ({ groupId, memberIds }: { groupId: string; memberIds: string[] }) =>
      api.updateGroupMembers(groupId, memberIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Group</h2>
        <CreateGroupForm 
          onGroupCreated = { (data:Partial<TodoGroup>) => createGroupMutation.mutate(data)}
         />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Manage Groups</h2>
        <GroupList
          groups={groups || []}
          isAdmin={true}
          onDeleteGroup={(groupId) => deleteGroupMutation.mutate(groupId)}
          onUpdateMembers={(groupId, memberIds) =>
            updateMembersMutation.mutate({ groupId, memberIds })
          }
        />
      </div>
    </div>
  );
};