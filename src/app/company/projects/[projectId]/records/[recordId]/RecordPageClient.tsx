"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Record, Task } from "@/lib";
import Link from 'next/link';
import { RecordPageClientProps } from '@/lib';
import { createTask, getTasksByRecordId, updateTask } from '@/actions';
import EditableTaskModal from '@/components/editableTaskModal';

export default function RecordPageClient({ record, projectId }: RecordPageClientProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ name: '', description: '', status: 'pending', assigned_to: '', due_date: '' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
  }, [fetchTasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTask(record.id, newTask);
      setNewTask({ name: '', description: '', status: 'pending', assigned_to: '', due_date: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
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

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleInputChange}
                placeholder="Task Name"
                className="w-full p-2 border rounded"
                required
              />
              <textarea
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Task Description"
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="text"
                name="assigned_to"
                value={newTask.assigned_to}
                onChange={handleInputChange}
                placeholder="Assigned To"
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                name="due_date"
                value={newTask.due_date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Create Task
              </button>
            </form>
          </div>
        </div>

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
          />
        )}
      </div>
    </div>
  );
}