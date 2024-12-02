import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GroupCard } from '../components/GroupCard';
import { TaskForm } from '../components/TaskForm';
import { Modal } from '../components/ui/Modal';
// import { useAuthStore } from '../store/authStore';
import * as api from '../services/api';
import { Task } from '../types';

export const TaskList: React.FC = () => {
  // const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: api.getGroups
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks()
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, formData }: { taskId: string; formData: FormData }) =>
      api.updateTask(taskId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
      setSelectedTask(null);
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: (formData: FormData) => api.createTask(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsModalOpen(false);
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

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    if (selectedTask) {
      await updateTaskMutation.mutateAsync({ taskId: selectedTask._id, formData });
    } else {
      await createTaskMutation.mutateAsync(formData);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId);
  };

  const handleTaskStatusChange = async (task: Partial<Task>, status: 'todo' | 'done') => {
    const formData = new FormData();
    formData.append('status', status);

    const taskId = task._id as string
    await updateTaskMutation.mutateAsync({ taskId , formData });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Todo Lists</h1>
        <button
          onClick={handleCreateTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create Task
        </button>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        title={selectedTask ? 'Edit Task' : 'Create Task'}
      >
        <TaskForm
          initialTask={selectedTask || undefined}
          groupId={selectedTask?.groupId || (groups?.data?.[0]?._id || '')}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
          }}
        />
      </Modal>
    </div>
  );
};