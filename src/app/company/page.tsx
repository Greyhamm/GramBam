import { getUserCompanies, getSession } from "@/actions";
import { Company } from "@/lib";
import CreateProjectModal from "@/components/createProjectModal";
import CompanySelector from "@/components/companySelector";
import InviteUserModal from "@/components/inviteUserModal";
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
      <div className="min-h-screen bg-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Welcome to the Company Page</h1>
          <div className="bg-blue-800 shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Create a New Project</h2>
            <CreateProjectModal companies={companies} userId={session.user?.id} />
          </div>
          <div className="bg-blue-800 shadow-lg rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Invite User</h2>
            <InviteUserModal companies={companies} userId={session.user?.id || ''} />
          </div>
          <CompanySelector companies={companies} />
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