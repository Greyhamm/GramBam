// src/components/projectsTable.tsx
import React from 'react';
import { Project, Company } from '@/lib';
import Link from 'next/link';
interface ProjectsTableProps {
  projects: Project[];
  companies: Company[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects, companies }) => {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Project Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Client
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {projects.map((project) => (
                <tr key={project.id} className="w-full border-b py-3 text-sm last-of-type:border-none">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link href={`/company/projects/${project.id}`} className="text-blue-500 hover:underline">
                      {project.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{project.description}</td>
                  <td className="whitespace-nowrap px-3 py-3">{project.client}</td>
                  <td className="whitespace-nowrap px-3 py-3">{new Date(project.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;
