"use client"; // This directive marks the component as a Client Component

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/actions"; // Adjust this import based on your session handling
import { Company, ProjectFormProps } from "@/lib";

const ProjectForm: React.FC<ProjectFormProps> = ({ companies, userId }) => {
  const router = useRouter();
  const [project, setProject] = useState({
    name: "",
    description: "",
    client: "",
    companyId: companies.length > 0 ? companies[0].id : "",
  });

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Call the createProject action
      const projectId = await createProject({
        companyId: project.companyId,
        name: project.name,
        description: project.description,
        client: project.client,
      });

      // Redirect to the newly created project page
      router.push(`/company/projects/${projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("An error occurred while creating the project. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Project Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={project.name}
            onChange={handleChange}
            required
            placeholder="Project Name"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            value={project.description}
            onChange={handleChange}
            required
            placeholder="Project Description"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="client"
          >
            Client
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="client"
            type="text"
            name="client"
            value={project.client}
            onChange={handleChange}
            placeholder="Client Name"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="companyId"
          >
            Company
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
