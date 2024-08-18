'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Record, Task, Project, CompanyUser } from "@/lib";
import Link from 'next/link';
import { RecordPageClientProps } from '@/lib';
import { createTask, getTasksByRecordId, updateTask, getCompanyUsers, getProjectById, updateRecord } from '@/actions';
import ViewTaskModal from '@/components/viewTaskModal';
import EditTaskModal from '@/components/editTaskModal';
import CreateTaskFormModal from '@/components/createTaskModal';
import EditRecordFormModal from '@/components/editRecordFormModal';
import { formatDateToLocal } from '../../../../../lib/utils';

export default function RecordPageClient({ record: initialRecord, projectId }: RecordPageClientProps) {
  const [record, setRecord] = useState<Record>({
    ...initialRecord,
    created_at: formatDateToLocal(initialRecord.created_at)
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditRecordModalOpen, setIsEditRecordModalOpen] = useState(false);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  const [project, setProject] = useState<Project | null>(null);


  const fetchTasks = useCallback(async () => {
    try {
      const fetchedTasks = await getTasksByRecordId(record.id);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [record.id]);

  useEffect(() => {
    fetchTasks();
    
    const fetchProjectAndUsers = async () => {
      try {
        const projectDetails = await getProjectById(projectId);
        if (projectDetails) {
          setProject(projectDetails);
          const users = await getCompanyUsers(projectDetails.company_id);
          setCompanyUsers(users);
        }
      } catch (error) {
        console.error('Error fetching project details or company users:', error);
      }
    };
    
    fetchProjectAndUsers();
  }, [fetchTasks, projectId]);

  const handleCreateTask = async (newTask: Omit<Task, 'id' | 'record_id' | 'created_at'>) => {
    try {
      await createTask(record.id, newTask);
      fetchTasks();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setViewingTask(null);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask);
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };


  const handleEditRecord = () => {
    setIsEditRecordModalOpen(true);
  };

  const handleSaveRecord = async (updatedRecord: Partial<Record>) => {
    try {
      const updated = await updateRecord(record.id, updatedRecord);
      setRecord({
        ...updated,
        created_at: formatDateToLocal(updated.created_at)
      });
      setIsEditRecordModalOpen(false);
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  const renderTaskColumn = (status: string) => {
    const filteredTasks = tasks.filter(task => task.status === status);
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white p-2 mb-2 rounded cursor-pointer" onClick={() => handleViewTask(task)}>
            <h4 className="font-semibold">{task.name}</h4>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
        ))}
      </div>
    );
  };


  return (
    <div className="bg-gradient-to-br from-orange-300 to-peach-300 text-primary-foreground min-h-screen">
      <div className="container mx-auto p-4">
        <Link href={`/company/projects/${projectId}`} className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          &larr; Back to Project
        </Link>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{record.name}</h1>
              <button 
                onClick={handleEditRecord}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Edit Record
              </button>
            </div>
            <p className="text-gray-600 mb-2">{record.description}</p>
            <p className="text-sm text-gray-500">Created At: {record.created_at}</p>
          </div>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-6"
        >
          Create New Task
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderTaskColumn('pending')}
          {renderTaskColumn('in_progress')}
          {renderTaskColumn('completed')}
        </div>

        {viewingTask && (
        <ViewTaskModal
          task={viewingTask}
          onClose={() => setViewingTask(null)}
          onEdit={() => handleEditTask(viewingTask)}
          companyUsers={companyUsers}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTask}
          companyUsers={companyUsers}
        />
      )}


        {isCreateModalOpen && (
          <CreateTaskFormModal
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleCreateTask}
            companyUsers={companyUsers}
          />
        )}

        {isEditRecordModalOpen && (
          <EditRecordFormModal
            record={record}
            onClose={() => setIsEditRecordModalOpen(false)}
            onSave={handleSaveRecord}
          />
        )}
      </div>
    </div>
  );
}