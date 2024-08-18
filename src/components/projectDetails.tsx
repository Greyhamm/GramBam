"use client";

import React, { useState, useEffect } from 'react';
import { Project } from "@/lib";
import { getProjectById, updateProjectById } from "@/actions";

interface ProjectDetailsProps {
  projectId: string;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedFields, setUpdatedFields] = useState<Partial<Project>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const fetchedProject = await getProjectById(projectId);
        if (fetchedProject) {
          setProject(fetchedProject);
        } else {
          setError("Project not found");
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError("Failed to fetch project");
      }
    };

    fetchProject();
  }, [projectId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (project) {
        const updatedProject = await updateProjectById(projectId, updatedFields);
        setProject(updatedProject);
        setIsEditing(false);
        setUpdatedFields({});
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setError("Failed to update project");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedFields({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-orange-300 to-peach-300 text-primary-foreground min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">
          {isEditing ? (
            <input
              name="name"
              value={updatedFields.name || project.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          ) : (
            project.name
          )}
        </h1>

        <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg relative">
          {isEditing ? (
            <>
              <textarea
                name="description"
                value={updatedFields.description || project.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">Project Description</h2>
              <p>{project.description}</p>
            </>
          )}
        </div>

        <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg mt-4 relative">
          <h2 className="text-xl font-semibold mb-2">Project Details</h2>
          <ul>
            <li>
              <strong>Client:</strong>{' '}
              {isEditing ? (
                <input
                  name="client"
                  value={updatedFields.client || project.client || ''}
                  onChange={handleChange}
                  className="p-1 border border-gray-300 rounded-md"
                />
              ) : (
                project.client || 'N/A'
              )}
            </li>
            <li><strong>Created At:</strong> {new Date(project.created_at).toLocaleDateString()}</li>
          </ul>
        </div>

        <div className="mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80 mr-2"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/80"
            >
              Edit Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;