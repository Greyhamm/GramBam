"use client";
import { useState, useEffect } from "react";
import { Company, Project } from "@/lib";
import { getCompanyProjects } from "@/actions";
import ProjectList from "./projectList";

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
      getCompanyProjects(selectedCompany.id).then((fetchedProjects) =>
        setProjects(fetchedProjects)
      );
    }
  }, [selectedCompany]);

  return (
    <div className="bg-blue-800 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Select a Company</h2>
      <ProjectList companies={companies} />
    </div>
  );
};

export default CompanySelector;