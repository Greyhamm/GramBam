'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { getSession, getUserCompanies, getUserTasks, createTask, updateTask, getCompanyUsers } from "@/actions";
import CreateCompany from "@/components/createcompanyForm";
import { Task, Company, CompanyUser } from "@/lib";
import ViewTaskModal from '@/components/viewTaskModal';
import EditTaskModal from '@/components/editTaskModal';
import CreateTaskModalProfile from '@/components/createTaskModalProfile';
import { formatDateToLocal } from '../lib/utils';

const ProfilePage = () => {
  const [session, setSession] = useState<any>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const sessionData = await getSession();
    setSession(sessionData);
    if (sessionData.isLoggedIn) {
      const fetchedCompanies = await getUserCompanies();
      setCompanies(fetchedCompanies);
      const fetchedTasks = await getUserTasks();
      setTasks([...fetchedTasks.todo, ...fetchedTasks.inProgress, ...fetchedTasks.done]);
      if (fetchedCompanies.length > 0) {
        const users = await getCompanyUsers(fetchedCompanies[0].id);
        setCompanyUsers(users);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTask = async (newTask: Omit<Task, 'id' | 'created_at'>) => {
    try {
      await createTask(newTask.record_id, newTask);
      fetchData();
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
      fetchData();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
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
              <p className="text-xs text-blue-700 mt-2">Due: {formatDateToLocal(task.due_date)}</p>
              <p className="text-xs text-blue-700">Created: {formatDateToLocal(task.created_at)}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!session?.isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto">
        <div className="bg-blue-800 shadow-lg rounded-lg mb-8 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors duration-200 shadow-lg"
            >
              Create New Task
            </button>
          </div>
        </div>

        <div className="flex flex-wrap -mx-4 mb-8">
          {renderTaskColumn('pending')}
          {renderTaskColumn('in_progress')}
          {renderTaskColumn('completed')}
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-4">Create a New Company</h2>
            <CreateCompany />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black mb-4">Your Companies</h2>
            <ul>
              {companies.length > 0 ? (
                companies.map((company) => (
                  <li key={company.id} className="text-black mb-2">
                    {company.name}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">You are not associated with any companies.</li>
              )}
            </ul>
          </div>
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
          <CreateTaskModalProfile
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleCreateTask}
            companies={companies}
            companyUsers={companyUsers}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;