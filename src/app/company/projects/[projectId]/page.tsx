import { getProjectById, getSession, fetchProjectRecords } from "@/actions";
import { Project, Record } from "@/lib";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from '@/lib';
import { getIronSession } from 'iron-session';
import { notFound } from 'next/navigation';
import ProjectPageClient from './ProjectPageClient';
import { formatDateToLocal} from '../../../lib/utils'

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

    // Format dates consistently
    const serializedProject: Project = {
      ...project,
      created_at: formatDateToLocal(project.created_at),
    };

    const serializedRecords: Record[] = records.map(record => ({
      ...record,
      created_at: formatDateToLocal(record.created_at),
    }));

    return <ProjectPageClient project={serializedProject} initialRecords={serializedRecords} />;
  } catch (error) {
    console.error('Error displaying project page:', error);
    notFound();
  }
}