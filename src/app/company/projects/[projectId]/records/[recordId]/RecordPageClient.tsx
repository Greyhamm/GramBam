"use client";

import React from 'react';
import { Record } from "@/lib";
import Link from 'next/link';
import { RecordPageClientProps } from '@/lib';


export default function RecordPageClient({ record, projectId }: RecordPageClientProps) {
  return (
    <div className="bg-gradient-to-br from-orange-300 to-peach-300 text-primary-foreground min-h-screen">
      <div className="container mx-auto p-4 ">
        <Link href={`/company/projects/${projectId}`} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          &larr; Back to Project
        </Link>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold mb-4">{record.name}</h1>
            <p className="text-gray-600 mb-2">{record.description}</p>
            <p className="text-sm text-gray-500">Created At: {record.created_at}</p>
          </div>
        </div>
      </div>
    </div>
  );
}