import React from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import { TodoGroup } from '../../types/index';

interface CreateGroupFormProps {
  onGroupCreated: (data: Partial<TodoGroup>) => void;
}

interface GroupFormData {
  name: string;
  description: string;
  visibility: 'public' | 'private';
}

export const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ onGroupCreated }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<GroupFormData>();

  const onSubmit = async (data: GroupFormData) => {
    try {
      reset();
      onGroupCreated(data);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Visibility</label>
          <select
            {...register('visibility')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Group
        </button>
      </div>
    </form>
  );
};