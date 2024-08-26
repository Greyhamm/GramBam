import React from 'react';
import { Task, CompanyUser } from '@/lib';
import { formatDateToLocal } from '../app/lib/utils'; // Adjust the import path as needed

interface ViewTaskModalProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  companyUsers: CompanyUser[];
}

const ViewTaskModal: React.FC<ViewTaskModalProps> = ({ task, onClose, onEdit, companyUsers }) => {
  const getAssignedUserName = (userId: string | null) => {
    if (!userId) return 'Unassigned';
    const user = companyUsers.find(u => u.id === userId);
    return user ? user.username : 'Unknown User';
  };

  const formattedDueDate = formatDateToLocal(task.due_date);
  const formattedCreatedAt = formatDateToLocal(task.created_at);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div className="colorful-form" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Task Details</h2>
        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">Task Name</label>
            <p className="form-input bg-gray-100">{task.name}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <p className="form-input bg-gray-100">{task.description}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <p className="form-input bg-gray-100">{task.status}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Assigned To</label>
            <p className="form-input bg-gray-100">{getAssignedUserName(task.assigned_to)}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Due Date</label>
            <p className="form-input bg-gray-100">{formattedDueDate}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Created At</label>
            <p className="form-input bg-gray-100">{formattedCreatedAt}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="form-button bg-gray-300 text-black hover:bg-gray-400">
              Close
            </button>
            <button onClick={onEdit} className="form-button">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;