import { getProjectById, getSession } from "@/actions";
import { Project } from "@/lib";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from '@/lib';
import { getIronSession } from 'iron-session';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    notFound();
  }

  const { projectId } = params;

  try {
    // Fetch the project details using the new function
    const project = await getProjectById(projectId);

    // If the project is not found, show a 404 page
    if (!project) {
      notFound();
    }

    // Render the project details
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
        <p className="mb-4"><strong>Description:</strong> {project.description}</p>
        <p className="mb-4"><strong>Client:</strong> {project.client}</p>
        <p className="mb-4"><strong>Created At:</strong> {new Date(project.created_at).toLocaleString()}</p>
      </div>
    );
  } catch (error) {
    console.error('Error displaying project page:', error);
    notFound(); // Handle error by showing a 404 page
  }
}
