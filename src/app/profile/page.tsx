'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { getSession, getUserCompanies, getUserTasks, createTask, updateTask, getCompanyUsers } from "@/actions";
import { Task, Company, CompanyUser } from "@/lib";
import ViewTaskModal from '@/components/viewTaskModal';
import EditTaskModal from '@/components/editTaskModal';
import CreateTaskModalProfile from '@/components/createTaskModalProfile';
import CreateCompanyModal from '@/components/createCompanyModal';
import { formatDateToLocal } from '../lib/utils';

const ProfilePage = () => {
  const [session, setSession] = useState<any>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [companyUsers, setCompanyUsers] = useState<CompanyUser[]>([]);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateCompanyModalOpen, setIsCreateCompanyModalOpen] = useState(false);

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
      setIsCreateTaskModalOpen(false);
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
    <div className="flex min-h-screen bg-blue-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 p-6">
        <h2 className="text-xl font-semibold mb-4">Your Companies</h2>
        <ul className="space-y-2 list-none"> {/* Added list-none class here */}
          {companies.length > 0 ? (
            companies.map((company) => (
              <li 
                key={company.id} 
                className="bg-blue-400 text-blue-900 px-4 py-2 rounded-md hover:bg-blue-300 transition-colors duration-200 cursor-pointer text-center"
              >
                {company.name}
              </li>
            ))
          ) : (
            <li className="text-gray-400">No companies yet</li>
          )}
        </ul>
        <button 
          onClick={() => setIsCreateCompanyModalOpen(true)}
          className="mt-4 w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200"
        >
          Create New Company
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="bg-blue-800 shadow-lg rounded-lg mb-8 p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <button 
              onClick={() => setIsCreateTaskModalOpen(true)} 
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

      {isCreateTaskModalOpen && (
        <CreateTaskModalProfile
          onClose={() => setIsCreateTaskModalOpen(false)}
          onSave={handleCreateTask}
          companies={companies}
          companyUsers={companyUsers}
        />
      )}

      {isCreateCompanyModalOpen && (
        <CreateCompanyModal
          onClose={() => setIsCreateCompanyModalOpen(false)}
          onCompanyCreated={fetchData}
        />
      )}
    </div>
  );
};

export default ProfilePage;