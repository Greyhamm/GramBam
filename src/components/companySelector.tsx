// src/components/companySelector.tsx
"use client";

import { useState, useEffect } from "react";
import { Company, Project } from "@/lib";
import { getCompanyProjects } from "@/actions";
import ProjectsTable from "./projectsTable";

interface CompanySelectorProps {
  companies: Company[];
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ companies }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(
    companies.length > 0 ? companies[0] : null
  );
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (selectedCompany) {
      // Fetch projects for the selected company
      getCompanyProjects(selectedCompany.id).then((fetchedProjects) =>
        setProjects(fetchedProjects)
      );
    }
  }, [selectedCompany]);

  return (
    <div>
      <select
        className="mb-4 p-2 border rounded"
        onChange={(e) =>
          setSelectedCompany(
            companies.find((company) => company.id === e.target.value) || null
          )
        }
        value={selectedCompany?.id}
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
      {selectedCompany && <ProjectsTable projects={projects} companies={companies} />}
    </div>
  );
};

export default CompanySelector;
