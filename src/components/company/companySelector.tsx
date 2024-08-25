"use client";
import { useState, useEffect } from "react";
import { Company } from "@/lib";

interface CompanySelectorProps {
  companies: Company[];
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ companies }) => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    // Dispatch an event when the selected company changes
    window.dispatchEvent(new CustomEvent('companySelected', { detail: selectedCompany }));
  }, [selectedCompany]);

  return (
    <select
      value={selectedCompany?.id || ''}
      onChange={(e) => {
        const company = companies.find(c => c.id === e.target.value) || null;
        setSelectedCompany(company);
      }}
      className="w-full p-2 bg-blue-700 text-white rounded"
    >
      <option value="">Select a company</option>
      {companies.map((company) => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </select>
  );
};

export default CompanySelector;