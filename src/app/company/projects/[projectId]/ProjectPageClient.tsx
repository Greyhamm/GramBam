"use client";

import React, { useState } from 'react';
import { Project, Record } from "@/lib";
import { fetchProjectRecords } from "@/actions";
import EditableProjectDetails from '@/components/editableProjectDetailsForm';
import dynamic from 'next/dynamic';

const AddRecordForm = dynamic(() => import('@/components/addRecordForm'), { ssr: false });

interface ProjectPageClientProps {
  project: Project;
  initialRecords: Record[];
}

export default function ProjectPageClient({ project, initialRecords }: ProjectPageClientProps) {
  const [showAddRecordForm, setShowAddRecordForm] = useState(false);
  const [records, setRecords] = useState<Record[]>(initialRecords);

  const handleAddRecord = () => {
    setShowAddRecordForm(true);
  };

  const handleCloseAddRecordForm = () => {
    setShowAddRecordForm(false);
  };

  const handleRecordAdded = async () => {
    try {
      const updatedRecords = await fetchProjectRecords(project.id);
      setRecords(updatedRecords);
      setShowAddRecordForm(false);
    } catch (error) {
      console.error('Error refreshing records:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-300 to-peach-300 text-primary-foreground min-h-screen">
      <div className="container mx-auto p-4">
        <EditableProjectDetails project={project} />
        
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Associated Records</h2>
            <button
              onClick={handleAddRecord}
              className="mt-2 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Add New Record
            </button>
            <ul className="mt-2 divide-y divide-gray-200">
              {records.map((record) => (
                <li key={record.id} className="py-4">
                  <div className="flex space-x-3">
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-medium">{record.name}</h3>
                      <p className="text-sm text-gray-500">{record.description}</p>
                      <p className="text-sm text-gray-500">Created At: {new Date(record.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {showAddRecordForm && (
          <AddRecordForm
            projectId={project.id}
            onClose={handleCloseAddRecordForm}
            onRecordAdded={handleRecordAdded}
          />
        )}
      </div>
    </div>
  );
}