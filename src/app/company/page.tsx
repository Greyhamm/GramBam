import { getUserCompanies } from "@/actions";
import ProjectForm from "@/components/projectForm"; // Adjust the import path if necessary
import { Company } from "@/lib";
import { getSession } from "@/actions";

const CompanyPage = async () => {
  try {
    // Fetch user companies using the reusable function
    const companies: Company[] = await getUserCompanies();

    // You can also fetch session details if required directly
    const session = await getSession();

    return (
      <div className='company'>
        <h1>Welcome to the company page</h1>
        <ProjectForm companies={companies} userId={session.user?.id} />
      </div>
    );
  } catch (error) {
    console.error("Error loading companies:", error);
    return (
      <div className='company'>
        <h1>Welcome to the company page</h1>
        <p>Failed to load your companies. Please try again later.</p>
      </div>
    );
  }
};

export default CompanyPage;