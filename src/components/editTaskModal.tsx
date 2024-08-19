import React, { useState, useEffect } from 'react';
import { Task, CompanyUser } from '@/lib';

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  companyUsers: CompanyUser[];
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onClose, onSave, companyUsers }) => {
  const [editedTask, setEditedTask] = useState<Task>(task);

  useEffect(() => {
    setEditedTask(task);
  }, [task]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedTask);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div className="colorful-form" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Task Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedTask.name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={editedTask.description}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={editedTask.status}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="assigned_to">Assigned To</label>
            <select
              id="assigned_to"
              name="assigned_to"
              value={editedTask.assigned_to || ''}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select User</option>
              {companyUsers.map(user => (
                <option key={user.id} value={user.id}>{user.username}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="due_date">Due Date</label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={editedTask.due_date || ''}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="form-button bg-gray-300 text-black hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="form-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;