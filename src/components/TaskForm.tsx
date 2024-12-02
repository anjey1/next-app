import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Task } from '../types';
import { useQuery } from '@tanstack/react-query';
import * as api from '../services/api';

interface TaskFormProps {
  initialTask?: Task;
  groupId: string;
  onSubmit: (taskData: FormData) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  groupId,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [selectedGroupId, setSelectedGroupId] = useState(groupId);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(initialTask?.imageUrl || '');

  const { data: groups } = useQuery({
    queryKey: ['groups'],
    queryFn: api.getGroups
  });

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setSelectedGroupId(initialTask.groupId);
      if (initialTask.imageUrl) {
        setPreview(initialTask.imageUrl);
      }
    }
  }, [initialTask]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('groupId', selectedGroupId);
    if (image) {
      formData.append('image', image);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Group</label>
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {groups?.data?.map((group) => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <img src={preview} alt="Preview" className="max-h-48 mx-auto" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setImage(null);
                setPreview('');
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              ×
            </button>
          </div>
        ) : (
          <p className="text-gray-600">Drag & drop an image here, or click to select one</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {initialTask ? 'Update' : 'Create'} Task
        </button>
      </div>
    </form>
  );
};