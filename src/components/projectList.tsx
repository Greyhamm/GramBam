"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { getCompanyProjects } from "@/actions";
import { Company, Project } from "@/lib";
import Link from 'next/link';

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

  return (
    <div className="bg-blue-800 shadow-lg rounded-lg p-6">
      <div className="mb-6">
        <label htmlFor="companySelect" className="block text-white text-sm font-bold mb-2">
          Select Company
        </label>
        <select
          id="companySelect"
          value={selectedCompanyId}
          onChange={handleCompanyChange}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
        >
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Projects</h2>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/company/projects/${project.id}`}>
                <div className="bg-blue-700 p-4 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors duration-200">
                  <h3 className="text-xl font-semibold mb-2 text-white">{project.name}</h3>
                  <p className="text-blue-200">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-white">No projects found for this company.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectList;