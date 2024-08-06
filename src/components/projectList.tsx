// src/components/ProjectPage.tsx
"use client";

import { useState, useEffect } from "react";
import { getCompanyProjects } from "@/actions"; 
import { Company, Project } from "@/lib";
import ProjectForm from "@/components/projectForm"; 

interface ProjectPageProps {
  companies: Company[];
  userId: string | undefined;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ companies, userId }) => {
  const [selectedCompany, setSelectedCompany] = useState<string>(companies[0]?.id || "");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (selectedCompany) {
      (async () => {
        try {
          const fetchedProjects = await getCompanyProjects(selectedCompany);
          setProjects(fetchedProjects);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      })();
    }
  }, [selectedCompany]);

  return (
    <div>
      <label htmlFor="companySelect">Select Company:</label>
      <select
        id="companySelect"
        value={selectedCompany}
        onChange={(e) => setSelectedCompany(e.target.value)}
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>

      <div>
        <h2>Projects</h2>
        <ul>
          {projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.id}>{project.name}</li>
            ))
          ) : (
            <li>No projects available for this company.</li>
          )}
        </ul>
      </div>

      <ProjectForm companies={companies} userId={userId} />
    </div>
  );
};

export default ProjectPage;
