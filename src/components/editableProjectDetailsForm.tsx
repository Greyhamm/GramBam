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
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {isEditing[field] ? (
          <div>
            {field === 'description' ? (
              <textarea
                name={field}
                value={editingFields[field] as string || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                rows={3}
              />
            ) : (
              <input
                type="text"
                name={field}
                value={editingFields[field] as string || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            )}
            <div className="mt-2">
              <button
                onClick={() => handleConfirm(field)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mr-2"
              >
                Confirm
              </button>
              <button
                onClick={() => handleCancel(field)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center mt-1">
            <span>{project[field] || 'N/A'}</span>
            <button
              onClick={() => handleEdit(field)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-orange-300 to-peach-300 text-primary-foreground min-h-screen">
      <div className="container mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-4">Project Details</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            {renderEditableField('name', 'Project Name')}
            {renderEditableField('description', 'Project Description')}
            {renderEditableField('client', 'Client')}
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Created At</label>
              <span className="mt-1 block">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Project Team</h2>
            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="flex items-center">
                <span>John Doe</span>
              </div>
              {/* Add more team members here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditableProjectDetails;