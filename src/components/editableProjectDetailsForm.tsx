"use client";

import React, { useState } from 'react';
import { Project } from "@/lib";
import { updateProjectById } from "@/actions";

interface EditableProjectDetailsProps {
  project: Project;
}

const EditableProjectDetails: React.FC<EditableProjectDetailsProps> = ({ project: initialProject }) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [editingFields, setEditingFields] = useState<Partial<Project>>({});
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
    client: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
    setEditingFields(prev => ({ ...prev, [field]: project[field] }));
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingFields(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async (field: keyof typeof isEditing) => {
    try {
      const updatedFields: Partial<Project> = { [field]: editingFields[field] };
      const updatedProject = await updateProjectById(project.id, updatedFields);
      setProject(updatedProject);
      setIsEditing(prev => ({ ...prev, [field]: false }));
      setEditingFields({});
      setError(null);
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update the project. Please try again.');
    }
  };

  const handleCancel = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({ ...prev, [field]: false }));
    setEditingFields(prev => ({ ...prev, [field]: undefined }));
  };

  const renderEditableField = (field: keyof typeof isEditing, label: string) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-blue-200 mb-2">{label}</label>
        {isEditing[field] ? (
          <div>
            {field === 'description' ? (
              <textarea
                name={field}
                value={editingFields[field] as string || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                rows={3}
              />
            ) : (
              <input
                type="text"
                name={field}
                value={editingFields[field] as string || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            )}
            <div className="mt-2 flex space-x-2">
              <button
                onClick={() => handleConfirm(field)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                Confirm
              </button>
              <button
                onClick={() => handleCancel(field)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-white">{project[field] || 'N/A'}</span>
            <button
              onClick={() => handleEdit(field)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <h1 className="text-3xl font-bold mb-4 text-white">Project Details</h1>
      
      <div className="bg-blue-800 shadow-lg rounded-lg p-6 mb-6">
        {renderEditableField('name', 'Project Name')}
        {renderEditableField('description', 'Project Description')}
        {renderEditableField('client', 'Client')}
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-blue-200 mb-2">Created At</label>
          <span className="text-white">
            {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="bg-blue-800 shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-white">Project Team</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-blue-700 p-3 rounded-lg">
            <span className="text-white">John Doe</span>
          </div>
          {/* Add more team members here */}
        </div>
      </div>
    </div>
  );
};

export default EditableProjectDetails;