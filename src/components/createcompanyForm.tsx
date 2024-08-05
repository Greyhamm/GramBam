"use client"; // Add this line at the top of the file

import { useState, FormEvent } from "react";
import { createCompany } from "@/actions";

const CreateCompany = () => {
  const [companyName, setCompanyName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      await createCompany(new FormData(e.currentTarget)); // Pass the form data

      // Clear the input field after successful submission
      setCompanyName("");
    } catch (error) {
      console.error("Error creating company:", error);
      alert("An error occurred while creating the company. Please try again.");
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
            htmlFor="companyName"
          >
            Company Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="companyName"
            type="text"
            name="companyName"
            value={companyName}
            onChange={handleChange}
            required
            placeholder="Company Name"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Company
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompany;
