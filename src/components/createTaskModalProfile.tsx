import React, { useState, useEffect } from 'react';
import { Task, CompanyUser, Company, Project, Record } from '@/lib';
import { getCompanyProjects, fetchProjectRecords } from '@/actions';

interface CreateTaskModalProfileProps {
  onClose: () => void;
  onSave: (newTask: Omit<Task, 'id' | 'created_at'>) => void;
  companies: Company[];
  companyUsers: CompanyUser[];
}

const CreateTaskModalProfile: React.FC<CreateTaskModalProfileProps> = ({
  onClose,
  onSave,
  companies,
  companyUsers,
}) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [records, setRecords] = useState<Record[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<string>('');
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'created_at'>>({
    name: '',
    description: '',
    status: 'pending',
    assigned_to: '',
    due_date: '',
    record_id: '',
  });

  useEffect(() => {
    if (selectedCompany) {
      getCompanyProjects(selectedCompany).then(setProjects);
    }
  }, [selectedCompany]);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectRecords(selectedProject).then(setRecords);
    }
  }, [selectedProject]);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompany(e.target.value);
    setSelectedProject('');
    setSelectedRecord('');
    setProjects([]);
    setRecords([]);
  };

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProject(e.target.value);
    setSelectedRecord('');
    setRecords([]);
  };

  const handleRecordChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecord(e.target.value);
    setNewTask(prev => ({ ...prev, record_id: e.target.value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.record_id) {
      alert('Please select a record for this task.');
      return;
    }
    onSave(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={selectedCompany}
            onChange={handleCompanyChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>

          <select
            value={selectedProject}
            onChange={handleProjectChange}
            className="w-full p-2 border rounded"
            required
            disabled={!selectedCompany}
          >
            <option value="">Select Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>

          <select
            value={selectedRecord}
            onChange={handleRecordChange}
            className="w-full p-2 border rounded"
            required
            disabled={!selectedProject}
          >
            <option value="">Select Record</option>
            {records.map(record => (
              <option key={record.id} value={record.id}>{record.name}</option>
            ))}
          </select>

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
          <select
            name="assigned_to"
            value={newTask.assigned_to}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select User</option>
            {companyUsers.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
          <input
            type="date"
            name="due_date"
            value={newTask.due_date}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModalProfile;