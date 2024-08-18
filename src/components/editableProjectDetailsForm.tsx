"use client";

import React, { useState } from 'react';
import { Project } from "@/lib";
import { updateProjectById } from "@/actions";

interface EditableProjectDetailsProps {
  project: Project;
}

const EditableProjectDetails: React.FC<EditableProjectDetailsProps> = ({ project: initialProject }) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [isEditing, setIsEditing] = useState({
    name: false,
    description: false,
    client: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (field: keyof typeof isEditing) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
    setError(null);
  };

  const handleSave = async (field: keyof typeof isEditing) => {
    try {
      const updatedFields: Partial<Project> = { [field]: project[field] };
      const updatedProject = await updateProjectById(project.id, updatedFields);
      setProject(updatedProject);
      setIsEditing(prev => ({ ...prev, [field]: false }));
      setError(null);
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update the project. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gradient-to-br from-orange-300 to-peach-300 text-primary-foreground min-h-screen">
      <div className="container mx-auto p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-4">
          {isEditing.name ? (
            <input
              name="name"
              value={project.name}
              onChange={handleChange}
              onBlur={() => handleSave('name')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <>
              {project.name}
              <button onClick={() => handleEdit('name')} className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80">
                Edit
              </button>
            </>
          )}
        </h1>
        
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg relative">
          <h2 className="text-xl font-semibold mb-2">Project Description</h2>
          {isEditing.description ? (
            <textarea
              name="description"
              value={project.description}
              onChange={handleChange}
              onBlur={() => handleSave('description')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            <>
              <p>{project.description}</p>
              <button onClick={() => handleEdit('description')} className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80">
                Edit
              </button>
            </>
          )}
        </div>

        <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg mt-4 relative">
          <h2 className="text-xl font-semibold mb-2">Project Details</h2>
          <ul>
            <li>
              <strong>Client:</strong>{' '}
              {isEditing.client ? (
                <input
                  name="client"
                  value={project.client || ''}
                  onChange={handleChange}
                  onBlur={() => handleSave('client')}
                  className="p-1 border border-gray-300 rounded-md"
                />
              ) : (
                <>
                  {project.client || 'N/A'}
                  <button onClick={() => handleEdit('client')} className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80">
                    Edit
                  </button>
                </>
              )}
            </li>
            <li><strong>Created At:</strong> {new Date(project.created_at).toLocaleDateString()}</li>
          </ul>
        </div>

        <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg mt-4 relative">
          <h2 className="text-xl font-semibold mb-2">Project Team</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* This would be dynamically filled with team members, if applicable */}
            <div className="flex items-center">
              <span>John Doe</span>
            </div>
            {/* Repeat for other team members */}
          </div>
        </div>

        <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg mt-4 relative">
          <h2 className="text-xl font-semibold mb-2">Associated Records</h2>
          <ul>
            <li>
              <strong>Name:</strong> Record 1
              <ul>
                <li><strong>Description:</strong> Lorem ipsum dolor sit amet</li>
                <li><strong>Created At:</strong> 2021-10-15</li>
                <li>
                  <strong>Tasks:</strong>
                  <ul>
                    <li>Task 1 - Due Date: 2021-11-20</li>
                    <li>Task 2 - Due Date: 2021-11-25</li>
                  </ul>
                </li>
              </ul>
            </li>
            {/* Repeat for other records */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditableProjectDetails;