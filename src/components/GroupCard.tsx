import React from 'react';
import { TodoGroup, Task } from '../types';
import { TaskCard } from './TaskCard';

interface GroupCardProps {
  group: TodoGroup;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskStatusChange: (taskId: string, status: 'todo' | 'done') => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  tasks,
  onEditTask,
  onDeleteTask,
  onTaskStatusChange,
}) => {
  const groupTasks = tasks.filter((task) => task.groupId === group._id);
  const completedTasks = groupTasks.filter((task) => task.status === 'done').length;
  const totalTasks = groupTasks.length;

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{group.name}</h2>
        <span className="text-sm text-gray-600">
          {completedTasks}/{totalTasks} completed
        </span>
      </div>
      <div className="space-y-4">
        {groupTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onStatusChange={onTaskStatusChange}
          />
        ))}
      </div>
    </div>
  );
};