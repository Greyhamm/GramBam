import { getProjectById, getSession } from "@/actions";
import { Project } from "@/lib";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from '@/lib';
import { getIronSession } from 'iron-session';
import { notFound } from 'next/navigation';
import Link from "next/link";

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
    const project: Project | null = await getProjectById(projectId);

    if (!project) {
      notFound();
    }

    return (
      <div className="bg-gradient-to-br from-orange-300 to-peach-300 text-primary-foreground min-h-screen">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">{project.name}</h1>
          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg relative">
            <button className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80">
              Edit
            </button>
            <h2 className="text-xl font-semibold mb-2">Project Description</h2>
            <p>{project.description}</p>
          </div>

          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg mt-4 relative">
            <button className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80">
              Edit
            </button>
            <h2 className="text-xl font-semibold mb-2">Project Details</h2>
            <ul>
              <li><strong>Client:</strong> {project.client || 'N/A'}</li>
              <li><strong>Created At:</strong> {new Date(project.created_at).toLocaleDateString()}</li>
            </ul>
          </div>

          <div className="bg-card text-card-foreground p-4 rounded-lg shadow-lg mt-4 relative">
            <button className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80">
              Edit
            </button>
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
            <button className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md hover:bg-primary/80">
              Edit
            </button>
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
  } catch (error) {
    console.error('Error displaying project page:', error);
    notFound();
  }
}
