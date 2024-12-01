import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { api } from '../services/api';
import { Task } from '../types';

interface TaskFormProps {
  initialTask?: Task;
  // groupId: string;
  // onSubmit: (taskData: Partial<Task>) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  initialTask,
  // groupId,
  // onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(null); // State to hold the image preview
  const navigate = useNavigate();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);

      const file = acceptedFiles[0]

      if (file) {
        const reader = new FileReader();
  
        // Read the file and set the preview URL
        reader.onload = () => {
          setPreview(reader.result);
        };
  
        reader.readAsDataURL(file); // Read the file as a data URL
      }
    },
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('groupId', groupId ?? '6748a255440c6330ab7482ec');
    formData.append('status', 'todo');
    if (image) {
      formData.append('image', image); // Attach the file
    }

    try {
      await api.post('/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
    //onSubmit();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center items-center mb-8">
        {/* <h1 className="text-2xl font-bold">Add Group Name Here :</h1> */}
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-3xl mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input type="file" name="image" {...getInputProps()} />
            <p className="text-gray-600">Drag & drop an image here, or click to select one</p>
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
              className="px-4 py-2 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {initialTask ? 'Update' : 'Create'} Task
            </button>
          </div>
          {preview && (
              <div className="mt-4 flex justify-center items-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-w-xs h-auto rounded-md"
                />
              </div>
            )}
        </form>
    </div>
  </div>
  );
};