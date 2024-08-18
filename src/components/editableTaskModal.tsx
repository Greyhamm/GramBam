import React, { useState } from 'react';
import { Task, CompanyUser } from '@/lib';

interface EditableTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  companyUsers: CompanyUser[];
}

const EditableTaskModal: React.FC<EditableTaskModalProps> = ({ task, onClose, onSave, companyUsers }) => {
  const [editedTask, setEditedTask] = useState<Task>(task);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={editedTask.name}
            onChange={handleInputChange}
            placeholder="Task Name"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
            placeholder="Task Description"
            className="w-full p-2 border rounded"
          />
          <select
            name="status"
            value={editedTask.status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            name="assigned_to"
            value={editedTask.assigned_to}
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
            value={editedTask.due_date}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditableTaskModal;