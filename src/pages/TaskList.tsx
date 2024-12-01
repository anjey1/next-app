import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GroupCard } from '../components/GroupCard';
import { useAuthStore } from '../store/authStore';
import * as api from '../services/api';
import { Task } from '../types';

export const TaskList: React.FC = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: api.getGroups
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks()
  });


  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, taskStatus }: { taskId: Partial<Task>; taskStatus?: 'todo' | 'done' }) => {
      const statusToUpdate = taskStatus || taskId.status || 'todo';
      taskId.status = statusToUpdate;
      return api.updateTask(taskId._id as string, taskId);
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: api.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  if (groupsLoading || tasksLoading) {
    return <div>Loading...</div>;
  }


  const handleEditTask = async (taskId: Partial<Task>, status: 'todo' | 'done') => {
    await updateTaskMutation.mutateAsync({ taskId, taskStatus: status});
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId);
  };

  const handleTaskStatusChange = async (taskId: Partial<Task>, status: 'todo' | 'done') => {
    console.log(status)
    await updateTaskMutation.mutateAsync({ taskId, taskStatus: status });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Todo Lists</h1>
      </div>

      <div className="space-y-6">
        {groups?.data?.map((group) => (
          <GroupCard
            key={group._id}
            group={group}
            tasks={tasks?.data?.filter(task => task.groupId === group._id) || []}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onTaskStatusChange={handleTaskStatusChange}
          />
        ))}
      </div>
    </div>
  );
};