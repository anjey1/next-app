import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const GroupDiscovery: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups', 'public'],
    queryFn: api.getGroups
  });

  const joinGroupMutation = useMutation({
    mutationFn: api.joinGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
    // onMutate: async (variables) => {
    //   // called after mutationFn
    //   // await queryClient.cancelQueries('data');
    //   // const previousData = queryClient.getQueryData('data');
    //   // queryClient.setQueryData('data', (old) => [...old, variables]);
    //   // return { previousData };
    // },
    onError: (error) => {
        // Handle errors (e.g., show a message to the user)
        console.error('Error joining the group:', error.message);
        alert('Failed to join the group. Please try again.');
    }
  });

  const handleJoinGroupChat = (groupId: string) => {
    navigate(`/group-chat/${groupId}`);
  };


  const leaveGroupMutation = useMutation({
      mutationFn: async () => {
          // Assuming api.leaveGroup is async
          return await api.leaveGroup;
      },
      onSuccess: () => {
          // Invalidate the "groups" query cache to refetch updated data
          queryClient.invalidateQueries({ queryKey: ['groups'] });
          // Optionally, show a success message
          console.log('Successfully left the group.');
      },
      onError: (error) => {
          // Handle errors (e.g., show a message to the user)
          console.error('Error leaving the group:', error.message);
          alert('Failed to leave the group. Please try again.');
      }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }



  const publicGroups = groups?.data?.filter(group => group.visibility === 'public') || [];

  // const handleLeaveGroup = async (groupId: string) => {
  //   try {
  //     await leaveGroupMutation.mutateAsync(groupId);
  //   } catch (error) {
  //     console.error('Failed to leave group:', error);
  //   }
  // };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Discover Groups</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publicGroups.map((group) => (
          <div key={group._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
            <p className="text-gray-600 mb-4">{group.description}</p>
            <div className="flex items-center justify-around">
              <span className="text-sm text-gray-500  mr-5">
                {Array.isArray(group.members) ? group.members.length : 0} members
              </span>
              {group.members.some(member => member._id === user?._id) ? (
                <div>
                <button
                  onClick={() => leaveGroupMutation.mutate(group._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors mr-5"
                  disabled={leaveGroupMutation.isPending || group.owner === user?._id}
                >
                  {leaveGroupMutation.isPending ? 'Leaving...' : 'Leave Group'}
                </button>
                <button
                  onClick={() => handleJoinGroupChat(group._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={leaveGroupMutation.isPending || group.owner === user?._id}
                >
                  {leaveGroupMutation.isPending ? 'Joining...' : 'Join Chat'}
                </button>
                </div>
              ) : (
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