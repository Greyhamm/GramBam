import React, { useState } from 'react';
import { Record } from '@/lib';

interface EditRecordFormModalProps {
  record: Record;
  onClose: () => void;
  onSave: (updatedRecord: Partial<Record>) => void;
}

const EditRecordFormModal: React.FC<EditRecordFormModalProps> = ({ record, onClose, onSave }) => {
  const [editedRecord, setEditedRecord] = useState<Partial<Record>>({
    name: record.name,
    description: record.description,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedRecord({ ...editedRecord, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedRecord);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={editedRecord.name}
            onChange={handleInputChange}
            placeholder="Record Name"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={editedRecord.description}
            onChange={handleInputChange}
            placeholder="Record Description"
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecordFormModal;