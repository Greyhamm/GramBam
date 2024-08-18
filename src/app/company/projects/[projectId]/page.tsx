import { getProjectById, getSession } from "@/actions";
import { Project } from "@/lib";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from '@/lib';
import { getIronSession } from 'iron-session';
import { notFound } from 'next/navigation';
import EditableProjectDetails from '@/components/editableProjectDetailsForm';

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

    return <EditableProjectDetails project={project} />;
  } catch (error) {
    console.error('Error displaying project page:', error);
    notFound();
  }
}