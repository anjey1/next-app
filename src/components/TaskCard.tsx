import React from 'react';
import { Task } from '../types';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (task: Task, status: 'todo' | 'done') => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-blue-600 hover:text-blue-800"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-2 text-red-600 hover:text-red-800"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {task.imageUrl && (
        <img
          src={task.imageUrl}
          alt={task.title}
          className="mt-2 rounded-md w-full h-40 object-cover"
        />
      )}
      <div className="mt-4 flex items-center">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={task.status === 'done'}
            onChange={(e) =>
              onStatusChange(task, e.target.checked ? 'done' : 'todo')
            }
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-sm text-gray-700">Mark as done</span>
        </label>
      </div>
    </div>
  );
};