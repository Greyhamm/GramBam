"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Project } from "@/lib";
import { getProjectById } from "@/actions";

interface ProjectDetailsProps {
  projectId: string;
}

export default function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [updatedProject, setUpdatedProject] = useState<Partial<Project>>({});
  const router = useRouter();

  useEffect(() => {
    async function fetchProject() {
      try {
        const fetchedProject = await getProjectById(projectId);
        if (fetchedProject) {
          setProject(fetchedProject);
        } else {
          router.push('/404'); // Redirect to 404 page if not found
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    }

    fetchProject();
  }, [projectId, router]);

  const handleEditClick = () => {
    setIsEditing(true);
    setUpdatedProject(project || {});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedProject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      if (project) {
        await updateProjectById(project.id, updatedProject);
        setProject({ ...project, ...updatedProject });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-orange-300 to-peach-300 text-primary-foreground min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{project.name}</h1>

        {/* Project Description */}
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg relative">
          {isEditing ? (
            <>
              <textarea
                name="description"
                value={updatedProject.description || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleSaveClick}
                className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditClick}
                className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80"
              >
                Edit
              </button>
              <h2 className="text-xl font-semibold mb-2">Project Description</h2>
              <p>{project.description}</p>
            </>
          )}
        </div>

        {/* Project Details */}
        <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg mt-4 relative">
          {isEditing ? (
            <>
              <input
                name="client"
                value={updatedProject.client || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={handleSaveClick}
                className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditClick}
                className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80"
              >
                Edit
              </button>
              <h2 className="text-xl font-semibold mb-2">Project Details</h2>
              <ul>
                <li><strong>Client:</strong> {project.client || "N/A"}</li>
                <li><strong>Created At:</strong> {new Date(project.created_at).toLocaleDateString()}</li>
              </ul>
            </>
          )}
        </div>

        {/* Other sections remain similar */}
      </div>
    </div>
  );
}
