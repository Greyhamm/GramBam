// src/components/projects/createTaskModal.tsx

import React, { useState, useEffect } from 'react';
import { Task, CompanyUser } from '@/lib';

interface CreateTaskFormModalProps {
  onClose: () => void;
  onSave: (newTask: Omit<Task, 'id' | 'record_id' | 'created_at' | 'assigned_by'>) => void;
  companyUsers: CompanyUser[];
  recordId: string;
}

const CreateTaskFormModal: React.FC<CreateTaskFormModalProps> = ({ onClose, onSave, companyUsers, recordId }) => {
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'record_id' | 'created_at' | 'assigned_by'>>({
    name: '',
    description: '',
    status: 'pending',
    assigned_to: '',
    due_date: ''
  });

  useEffect(() => {
    console.log('Company users in CreateTaskFormModal:', companyUsers);
  }, [companyUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={newTask.name}
            onChange={handleInputChange}
            placeholder="Task Name"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            placeholder="Task Description"
            className="w-full p-2 border rounded"
          />
          <select
            name="status"
            value={newTask.status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            name="assigned_to"
            value={newTask.assigned_to}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select User</option>
            {companyUsers.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
          <input
            type="date"
            name="due_date"
            value={newTask.due_date}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskFormModal;