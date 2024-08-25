import { acceptInvitation, getSession } from "@/actions";
import { redirect } from "next/navigation";

export default async function AcceptInvitationPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;
  const session = await getSession();

  if (!session.isLoggedIn) {
    return redirect(`/login?redirect=/accept-invitation?token=${token}`);
  }

  try {
    if (!token) {
      throw new Error('No invitation token provided');
    }

    if (session.user) {
      await acceptInvitation(token, session.user.id);
    } else {
      throw new Error('User not found in session');
    }

    return (
      <div className="min-h-screen bg-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Invitation Accepted</h1>
          <p className="text-xl">You have successfully joined the company.</p>
          <a href="/profile" className="mt-4 inline-block bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors duration-200">
            Go to Profile
          </a>
        </div>
      </div>
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return (
      <div className="min-h-screen bg-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Error Accepting Invitation</h1>
          <p className="text-xl text-red-300">{errorMessage}</p>
        </div>
      </div>
    );
  }
}