"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSession, createProject} from "@/actions"; // Adjust this import based on your session handling
import { sql } from "@vercel/postgres";
import { Company, ProjectFormProps } from "@/lib";

const ProjectForm: React.FC<ProjectFormProps> = ({ companies, userId }) => {
    const router = useRouter();
    const [project, setProject] = useState({
      name: "",
      description: "",
      client: "",
      companyId: companies.length > 0 ? companies[0].id : "",
    });
  
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        console.error('Error creating project:', error);
        alert("An error occurred while creating the project. Please try again.");
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input type="text" name="name" value={project.name} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <textarea name="description" value={project.description} onChange={handleChange} required />
        </label>
        <label>
          Client:
          <input type="text" name="client" value={project.client} onChange={handleChange} />
        </label>
        <label>
          Company:
          <select name="companyId" value={project.companyId} onChange={handleChange} required>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Create Project</button>
      </form>
    );
  };
  
  export default ProjectForm;
  