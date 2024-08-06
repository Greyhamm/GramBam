// src/app/company/page.tsx

import { getUserCompanies, getSession } from "@/actions";
import { Company } from "@/lib";
import CreateProjectModal from "@/components/createProjectModal"; // Client Component
import CompanySelector from "@/components/companySelector"; // Client Component

export default async function CompanyPage() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return (
        <div>
          <h1>Welcome to the company page</h1>
          <p>You must be logged in to view this page.</p>
        </div>
      );
    }

    const companies: Company[] = await getUserCompanies();

    return (
      <div className="company">
        <h1>Welcome to the company page</h1>
        <div className="my-4">
          <CreateProjectModal companies={companies} userId={session.user?.id} />
        </div>
        <CompanySelector companies={companies} />
      </div>
    );
  } catch (error) {
    console.error("Error loading companies:", error);
    return (
      <div className="company">
        <h1>Welcome to the company page</h1>
        <p>Failed to load your companies. Please try again later.</p>
      </div>
    );
  }
}
