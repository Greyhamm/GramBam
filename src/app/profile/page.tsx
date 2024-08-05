import { getSession, getUserCompanies } from "@/actions";
import CreateCompany from "@/components/createcompanyForm";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
  // Get the user's session
  const session = await getSession();

  // Redirect if not logged in
  if (!session.isLoggedIn) {
    redirect("/");
    return null; // Ensuring that the function doesn't continue executing
  }

  // Fetch the user's companies
  const companies = await getUserCompanies();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4"></h1>
      
      <div className="grid gap-7 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-black mb-4">Create a New Company</h2>
          <CreateCompany />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold  text-black mb-4">Your Companies</h2>
          <ul>
            {companies.length > 0 ? (
              companies.map((company) => (
                <li key={company.id} className="text-black mb-2">
                  {company.name}
                </li>
              ))
            ) : (
              <li className="text-gray-500">You are not associated with any companies.</li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
