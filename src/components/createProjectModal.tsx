// src/components/createProjectModal.tsx
"use client";

import { useState } from "react";
import ProjectForm from "@/components/projectForm";
import { ProjectFormProps } from "@/lib";

const CreateProjectModal: React.FC<ProjectFormProps> = ({ companies, userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={toggleModal}
      >
        Create Project
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Create Project</h2>
              <button onClick={toggleModal} className="text-gray-600 hover:text-gray-900">
                X
              </button>
            </div>
            <ProjectForm companies={companies} userId={userId} />
          </div>
        </div>
      )}
    </>
  );
};

export default CreateProjectModal;
