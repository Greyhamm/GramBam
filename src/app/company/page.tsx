import { getUserCompanies, getSession } from "@/actions";
import { Company } from "@/lib";
import CreateProjectModal from "@/components/createProjectCompanyModal";
import CompanySelector from "@/components/companySelector";
import ProjectList from "@/components/projectList";
import Sidebar from "@/components/companySidebar";
import Link from 'next/link';

export default async function CompanyPage() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return (
        <div className="min-h-screen bg-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Company Page</h1>
            <p className="text-xl">You must be logged in to view this page.</p>
            <Link href="/login" className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors duration-200">
              Log In
            </Link>
          </div>
        </div>
      );
    }

    const companies: Company[] = await getUserCompanies();

    return (
      <div className="flex min-h-screen bg-blue-900 text-white">
        <Sidebar userId={session.user?.id || ''} companies={companies} />
        <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Welcome to the Company Page</h1>

            {/* Company Selector */}
            <div className="bg-blue-800 shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Select a Company</h2>
              <CompanySelector companies={companies} />
            </div>

            {/* Create New Project */}
            <div className="bg-blue-800 shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Create a New Project</h2>
              <CreateProjectModal companies={companies} userId={session.user?.id} />
            </div>

            {/* Project List */}
            <div className="bg-blue-800 shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Projects</h2>
              <ProjectList />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading companies:", error);
    return (
      <div className="min-h-screen bg-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Welcome to the Company Page</h1>
          <p className="text-xl text-red-300">Failed to load your companies. Please try again later.</p>
        </div>
      </div>
    );
  }
}