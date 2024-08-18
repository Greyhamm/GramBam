"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Record, Task, Project, CompanyUser } from "@/lib";
import Link from 'next/link';
import { RecordPageClientProps } from '@/lib';
import { createTask, getTasksByRecordId, updateTask, getCompanyUsers, getProjectById } from '@/actions';
import EditableTaskModal from '@/components/editableTaskModal';
import CreateTaskFormModal from '@/components/createTaskModal';

export default function RecordPageClient({ record, projectId }: RecordPageClientProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
        console.log('Fetching project details for project ID:', projectId);
        const projectDetails = await getProjectById(projectId);
        console.log('Fetched project details:', projectDetails);

        if (projectDetails) {
          setProject(projectDetails);
          console.log('Fetching users for company ID:', projectDetails.company_id);
          const users = await getCompanyUsers(projectDetails.company_id);
          console.log('Fetched company users:', users);
          setCompanyUsers(users);
        } else {
          console.error('Project details not found');
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

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const renderTaskColumn = (status: string) => {
    const filteredTasks = tasks.filter(task => task.status === status);
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">{status.charAt(0).toUpperCase() + status.slice(1)}</h3>
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white p-2 mb-2 rounded cursor-pointer" onClick={() => handleEditTask(task)}>
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
            <h1 className="text-2xl font-bold mb-4">{record.name}</h1>
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

        {editingTask && (
          <EditableTaskModal
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
      </div>
    </div>
  );
}