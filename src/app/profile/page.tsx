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
    <div className="profile">
      <div>
        <h1>Welcome to the profile page</h1>
        <p>Welcome, <b>{session.user?.username}</b></p>
      </div>
      <div>
        <CreateCompany />
        <p>Your Companies:</p>
        <ul>
          {companies.length > 0 ? (
            companies.map((company) => (
              <li key={company.id}>{company.name}</li>
            ))
          ) : (
            <li>You are not associated with any companies.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
