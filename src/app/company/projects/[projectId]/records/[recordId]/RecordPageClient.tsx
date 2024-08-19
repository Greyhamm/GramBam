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
      <div className="w-full md:w-1/3 p-4">
        <h3 className="text-xl font-bold text-white mb-4">{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
        <div className="bg-blue-800 rounded-lg p-4">
          {filteredTasks.map(task => (
            <div 
              key={task.id} 
              className="bg-orange-300 p-4 rounded-lg mb-4 cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200" 
              onClick={() => handleViewTask(task)}
            >
              <h4 className="font-semibold text-blue-900">{task.name}</h4>
              <p className="text-sm text-blue-800">{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <Link href={`/company/projects/${projectId}`} className="text-blue-300 hover:text-blue-100 mb-8 inline-block">
          &larr; Back to Project
        </Link>
        <div className="bg-blue-800 shadow-lg rounded-lg mb-8 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-7xl font-bold">{record.name}</h1>
            <button 
              onClick={handleEditRecord}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Edit Record
            </button>
          </div>
          <p className="text-blue-200 mb-2">{record.description}</p>
          <p className="text-sm text-blue-300">Created At: {record.created_at}</p>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors duration-200 mb-8 shadow-lg"
        >
          Create New Task
        </button>

        <div className="flex flex-wrap -mx-4">
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