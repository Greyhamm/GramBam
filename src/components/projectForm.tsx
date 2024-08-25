"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/actions";
import { Company, ProjectFormProps } from "@/lib";

interface ExtendedProjectFormProps extends ProjectFormProps {
  initialCompanyId?: string;
}

const ProjectForm: React.FC<ExtendedProjectFormProps> = ({ companies, userId, initialCompanyId }) => {
  const router = useRouter();
  const [project, setProject] = useState({
    name: "",
    description: "",
    client: "",
    companyId: initialCompanyId || (companies.length > 0 ? companies[0].id : ""),
  });

  useEffect(() => {
    if (initialCompanyId) {
      setProject(prev => ({ ...prev, companyId: initialCompanyId }));
    }
  }, [initialCompanyId]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const projectId = await createProject({
        companyId: project.companyId,
        name: project.name,
        description: project.description,
        client: project.client,
      });
      router.push(`/company/projects/${projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("An error occurred while creating the project. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block text-blue-200 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Project Name
        </label>
        <input
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          id="name"
          type="text"
          name="name"
          value={project.name}
          onChange={handleChange}
          required
          placeholder="Enter project name"
        />
      </div>
      <div>
        <label
          className="block text-blue-200 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          id="description"
          name="description"
          value={project.description}
          onChange={handleChange}
          required
          placeholder="Enter project description"
          rows={4}
        />
      </div>
      <div>
        <label
          className="block text-blue-200 text-sm font-bold mb-2"
          htmlFor="client"
        >
          Client
        </label>
        <input
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          id="client"
          type="text"
          name="client"
          value={project.client}
          onChange={handleChange}
          placeholder="Enter client name"
        />
      </div>
      <div>
        <label
          className="block text-blue-200 text-sm font-bold mb-2"
          htmlFor="companyId"
        >
          Company
        </label>
        <select
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
          id="companyId"
          name="companyId"
          value={project.companyId}
          onChange={handleChange}
          required
        >
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <button
          className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-200 shadow-lg text-sm font-semibold"
          type="submit"
        >
          Create Project
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;