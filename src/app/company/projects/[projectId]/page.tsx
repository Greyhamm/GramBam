import { getProjectById, getSession, fetchProjectRecords } from "@/actions";
import { Project, Record } from "@/lib";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from '@/lib';
import { getIronSession } from 'iron-session';
import { notFound } from 'next/navigation';
import ProjectPageClient from './ProjectPageClient';

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
    const [project, records] = await Promise.all([
      getProjectById(projectId),
      fetchProjectRecords(projectId)
    ]);

    if (!project) {
      notFound();
    }

    return <ProjectPageClient project={project} initialRecords={records} />;
  } catch (error) {
    console.error('Error displaying project page:', error);
    notFound();
  }
}