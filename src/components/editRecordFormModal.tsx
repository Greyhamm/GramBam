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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div className="colorful-form" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Edit Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Record Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedRecord.name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="description">Record Description</label>
            <textarea
              id="description"
              name="description"
              value={editedRecord.description}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="form-button bg-gray-300 text-black hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="form-button"
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