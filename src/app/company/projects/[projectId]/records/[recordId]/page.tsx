// page.tsx

import { getRecordById, getSession } from "@/actions";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from '@/lib';
import { getIronSession } from 'iron-session';
import { notFound } from 'next/navigation';
import RecordPageClient from './RecordPageClient';
import { formatDateToLocal } from '../../../../../lib/utils';
import { RecordPageProps } from "@/lib";


export default async function RecordPage({ params }: RecordPageProps) {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    if (!session.isLoggedIn) {
      notFound();
    }
  
    const { projectId, recordId } = params;
  
    try {
      const record = await getRecordById(recordId);
  
      if (!record || record.project_id !== projectId) {
        notFound();
      }
  
      // Format date consistently
      const serializedRecord = {
        ...record,
        created_at: formatDateToLocal(record.created_at),
      };
  
      return <RecordPageClient record={serializedRecord} projectId={projectId} />;
    } catch (error) {
      console.error('Error displaying record page:', error);
      notFound();
    }
  }