"use client";
import React, { useState, useEffect } from 'react';
import { Project, Company } from "@/lib";
import { getCompanyProjects } from "@/actions";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

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
      getCompanyProjects(selectedCompany.id).then(setProjects);
    } else {
      setProjects([]);
    }
  }, [selectedCompany]);

  if (!selectedCompany) {
    return <p>Please select a company to view its projects.</p>;
  }

  if (projects.length === 0) {
    return <p>No projects found for this company.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div key={project.id} className="bg-blue-700 p-4 rounded shadow">
          <h3 className="text-xl font-bold mb-2">{project.name}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;