import React, { useState } from 'react';
import { createCompany } from '@/actions';

interface CreateCompanyModalProps {
  onClose: () => void;
  onCompanyCreated: () => void;
}

const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({ onClose, onCompanyCreated }) => {
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      alert('Please enter a company name');
      return;
    }

    const formData = new FormData();
    formData.append('companyName', companyName);

    try {
      await createCompany(formData);
      onCompanyCreated();
      onClose();
    } catch (error) {
      console.error('Error creating company:', error);
      alert('An error occurred while creating the company. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="colorful-form">
        <h2 className="text-xl font-bold mb-4">Create New Company</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="companyName" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="form-input"
              placeholder="Enter company name"
              required
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
              Create Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCompanyModal;