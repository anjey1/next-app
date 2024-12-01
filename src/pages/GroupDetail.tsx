import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GroupChat } from '../components/groups/GroupChat';
import { MemberManagement } from '../components/groups/MemberManagement';
import { useAuthStore } from '../store/authStore';
import * as api from '../services/api';

export const GroupDetail: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuthStore();

  const { data: group, isLoading } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => api.getGroups().then(groups => groups.find(g => g._id === groupId)),
    enabled: !!groupId
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', groupId],
    queryFn: () => groupId ? api.getMessages(groupId) : Promise.resolve([]),
    enabled: !!groupId
  });

  if (isLoading || !group) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <p className="text-gray-600 mt-2">{group.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GroupChat
            groupId={groupId!}
            messages={messages || []}
            onSendMessage={(content) => api.sendMessage(groupId!, content)}
          />
        </div>
        
        {user?.isAdmin && (
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Manage Members</h2>
              <MemberManagement groupId={groupId!} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};