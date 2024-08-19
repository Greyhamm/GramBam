'use client';
import React, { useState } from 'react';
import { Project, Record } from "@/lib";
import { fetchProjectRecords } from "@/actions";
import EditableProjectDetails from '@/components/editableProjectDetailsForm';
import dynamic from 'next/dynamic';
import { formatDateToLocal } from '../../../lib/utils';
import Link from 'next/link';

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
      const formattedRecords = updatedRecords.map(record => ({
        ...record,
        created_at: formatDateToLocal(record.created_at),
      }));
      setRecords(formattedRecords);
      setShowAddRecordForm(false);
    } catch (error) {
      console.error('Error refreshing records:', error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="bg-blue-800 shadow-lg rounded-lg mb-8 p-6">
          <EditableProjectDetails project={project} />
        </div>

        <div className="bg-blue-800 shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Associated Records</h2>
            <button
              onClick={handleAddRecord}
              className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors duration-200 shadow-lg"
            >
              Add New Record
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <Link key={record.id} href={`/company/projects/${project.id}/records/${record.id}`}>
                <div className="bg-blue-700 p-4 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors duration-200">
                  <h3 className="text-xl font-semibold mb-2">{record.name}</h3>
                  <p className="text-blue-200 mb-2">{record.description}</p>
                  <p className="text-sm text-blue-300">Created At: {record.created_at}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {showAddRecordForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <AddRecordForm
                projectId={project.id}
                onClose={handleCloseAddRecordForm}
                onRecordAdded={handleRecordAdded}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}