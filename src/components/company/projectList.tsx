'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Project, Company, CompanyUser } from "@/lib";
import { fetchProjectsWithTasks, searchProjects, fetchUsers, fetchCompanyClients } from "@/actions";

interface ProjectListProps {
  initialCompany?: Company | null;
}

const ProjectList: React.FC<ProjectListProps> = ({ initialCompany }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(initialCompany || null);
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const projectsPerPage = 9;

  const loadProjectsAndData = useCallback(async (companyId: string, page: number) => {
    setIsLoading(true);
    try {
      console.log(`Fetching projects for company ${companyId}, page ${page}`);
      const [projectsResult, fetchedUsers, fetchedClients] = await Promise.all([
        fetchProjectsWithTasks(companyId, projectsPerPage, (page - 1) * projectsPerPage),
        fetchUsers(companyId),
        fetchCompanyClients(companyId)
      ]);
      
      console.log(`Received ${projectsResult.data.length} projects, total: ${projectsResult.total}`);
      console.log('Projects:', projectsResult.data);
      
      setProjects(projectsResult.data);
      setDisplayedProjects(projectsResult.data);
      setTotalProjects(projectsResult.total);
      setUsers(fetchedUsers);
      setClients(fetchedClients);
    } catch (error) {
      console.error('Error loading projects and data:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  }, [projectsPerPage]);

  useEffect(() => {
    const handleCompanySelected = (event: CustomEvent) => {
      setSelectedCompany(event.detail);
      setProjects([]);
      setDisplayedProjects([]);
      setCurrentPage(1);
    };
    window.addEventListener('companySelected', handleCompanySelected as EventListener);
    return () => {
      window.removeEventListener('companySelected', handleCompanySelected as EventListener);
    };
  }, []);

  useEffect(() => {
    if (selectedCompany) {
      loadProjectsAndData(selectedCompany.id, currentPage);
    }
  }, [selectedCompany, currentPage, loadProjectsAndData]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/company/projects/${projectId}`);
  };

  const handleSearch = async () => {
    if (selectedCompany && searchTerm) {
      const results = await searchProjects(selectedCompany.id, searchTerm);
      setDisplayedProjects(results);
      setTotalProjects(results.length);
      setCurrentPage(1);
    } else if (selectedCompany) {
      loadProjectsAndData(selectedCompany.id, 1);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const applyFilters = () => {
    let filteredProjects = projects;

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
    setTotalProjects(filteredProjects.length);
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      client: "",
      leadUser: "",
      startDate: "",
      endDate: ""
    });
    if (selectedCompany) {
      loadProjectsAndData(selectedCompany.id, 1);
    }
    setIsFilterModalOpen(false);
  };

  const getUsernameById = (userId: string | undefined): string => {
    if (!userId) return 'N/A';
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (!selectedCompany) {
    return <p className="text-white">Please select a company to view its projects.</p>;
  }

  const totalPages = Math.ceil(totalProjects / projectsPerPage);

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
         {isLoading ? (
        <p className="text-white">Loading projects...</p>
      ) : (
        <>
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
          <p className="text-white mt-4">Showing {displayedProjects.length} projects (Page {currentPage} of {totalPages})</p>
        </>
      )}

      {/* Pagination controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-l disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-r disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProjectList;