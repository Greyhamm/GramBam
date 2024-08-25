"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Project, Company, CompanyUser } from "@/lib";
import { fetchProjectsWithTasks, searchProjects, fetchUsers, fetchCompanyClients } from "@/actions";

interface ProjectListProps {
  onModalOpen?: (isOpen: boolean) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onModalOpen }) => {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [clients, setClients] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    client: "",
    leadUser: "",
    startDate: "",
    endDate: ""
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleCompanySelected = (event: CustomEvent) => {
      setSelectedCompany(event.detail);
    };
    window.addEventListener('companySelected', handleCompanySelected as EventListener);
    return () => {
      window.removeEventListener('companySelected', handleCompanySelected as EventListener);
    };
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      fetchProjectsWithTasks(selectedCompany.id).then(projects => {
        setAllProjects(projects);
        setDisplayedProjects(projects);
      });
      fetchUsers(selectedCompany.id).then(setUsers);
      fetchCompanyClients(selectedCompany.id).then(setClients);
    } else {
      setAllProjects([]);
      setDisplayedProjects([]);
      setUsers([]);
      setClients([]);
    }
  }, [selectedCompany]);

  useEffect(() => {
    // Notify parent component about modal state
    onModalOpen?.(isFilterModalOpen);
  }, [isFilterModalOpen, onModalOpen]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/company/projects/${projectId}`);
  };

  const handleSearch = async () => {
    if (selectedCompany && searchTerm) {
      const results = await searchProjects(selectedCompany.id, searchTerm);
      setDisplayedProjects(results);
    } else {
      setDisplayedProjects(allProjects);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = () => {
    let filteredProjects = allProjects;

    if (filters.client) {
      filteredProjects = filteredProjects.filter(project => project.client === filters.client);
    }
    if (filters.leadUser) {
      filteredProjects = filteredProjects.filter(project => project.lead_user === filters.leadUser);
    }
    if (filters.startDate) {
      filteredProjects = filteredProjects.filter(project => new Date(project.created_at) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filteredProjects = filteredProjects.filter(project => new Date(project.created_at) <= new Date(filters.endDate));
    }

    setDisplayedProjects(filteredProjects);
    setIsFilterModalOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      client: "",
      leadUser: "",
      startDate: "",
      endDate: ""
    });
    setDisplayedProjects(allProjects);
    setIsFilterModalOpen(false);
  };

  const getUsernameById = (userId: string | undefined): string => {
    if (!userId) return 'N/A';
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  };

  if (!selectedCompany) {
    return <p className="text-white">Please select a company to view its projects.</p>;
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded mr-2 flex-grow"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200 mr-2"
        >
          Search
        </button>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
        >
          Filters
        </button>
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ zIndex: 1000 }}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="font-bold mb-4">Filters</h3>
            <div className="space-y-4">
              <select
                name="client"
                value={filters.client}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All Clients</option>
                {clients.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
              <select
                name="leadUser"
                value={filters.leadUser}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
              >
                <option value="">All Lead Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
              </select>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="Start Date"
              />
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded"
                placeholder="End Date"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={applyFilters}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-200"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedProjects.map((project) => (
          <div
            key={project.id}
            className="bg-blue-700 p-4 rounded shadow cursor-pointer hover:bg-blue-600 transition-colors duration-200"
            onClick={() => handleProjectClick(project.id)}
          >
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <p>{project.description}</p>
            <p className="mt-2">Client: {project.client ?? 'N/A'}</p>
            <p>Lead User: {getUsernameById(project.lead_user)}</p>
            <p>Created: {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;