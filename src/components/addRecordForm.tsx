"use client";
import React, { useState } from 'react';
import { createRecord } from '@/actions';

interface AddRecordFormProps {
  projectId: string;
  onClose: () => void;
  onRecordAdded: () => void;
}

const AddRecordForm: React.FC<AddRecordFormProps> = ({ projectId, onClose, onRecordAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createRecord(projectId, { name, description });
      onRecordAdded();
      onClose();
    } catch (err) {
      setError('Failed to create record. Please try again.');
      console.error('Error creating record:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="my-modal">
      <div className="relative p-8 w-full max-w-md m-auto bg-blue-800 rounded-lg shadow-lg">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-white mb-4">Add New Record</h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-blue-200 mb-1">Record Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter record name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-blue-200 mb-1">Description</label>
              <textarea
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                rows={4}
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 transition-colors duration-200"
              >
                Add Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecordForm;