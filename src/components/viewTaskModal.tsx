import React from 'react';
import { Task, CompanyUser } from '@/lib';

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Task Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <p className="mt-1">{task.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <p className="mt-1">{task.description}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <p className="mt-1">{task.status}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
            <p className="mt-1">{getAssignedUserName(task.assigned_to)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <p className="mt-1">{task.due_date || 'Not set'}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400">
              Close
            </button>
            <button onClick={onEdit} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskModal;