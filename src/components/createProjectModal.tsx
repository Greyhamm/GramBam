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
        className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors duration-200 shadow-lg"
        onClick={toggleModal}
      >
        Create New Project
      </button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-blue-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-white">Create Project</h2>
              <button onClick={toggleModal} className="text-white hover:text-gray-300">
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