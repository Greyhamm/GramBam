// src/components/projectList.tsx
"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { getCompanyProjects } from "@/actions"; // Import the getCompanyProjects function
import { Company, Project } from "@/lib";

interface ProjectListProps {
  companies: Company[];
  userId?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ companies, userId }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(companies[0]?.id);
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (selectedCompanyId) {
      // Fetch the projects for the selected company
      const fetchProjects = async () => {
        try {
          const projects = await getCompanyProjects(selectedCompanyId);
          setProjects(projects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };
      fetchProjects();
    }
  }, [selectedCompanyId]);

  const handleCompanyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompanyId(event.target.value);
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/company/projects/${projectId}`);
  };

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="companySelect" className="block text-gray-700 text-sm font-bold mb-2">
          Select Company
        </label>
        <select
          id="companySelect"
          value={selectedCompanyId}
          onChange={handleCompanyChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Projects</h2>
        <ul>
          {projects.length > 0 ? (
            projects.map((project) => (
              <li
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="cursor-pointer text-blue-500 hover:underline"
              >
                {project.name}
              </li>
            ))
          ) : (
            <li>No projects found for this company.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProjectList;
