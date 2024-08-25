// src/app/profile/page.tsx
import { getSession, checkPendingInvitations } from "@/actions";
import ProfilePage from "@/components/profile/profilePage";

export default async function ProfilePageWrapper() {
  const session = await getSession();
  
  // Extract only serializable data from the session
  const serializableSession = {
    isLoggedIn: session.isLoggedIn,
    userId: session.user?.id,
    username: session.user?.username,
    email: session.user?.email, // Add email for invitation checking
  };

  let pendingInvitations = [];
  if (session.isLoggedIn && session.user?.email) {
    pendingInvitations = await checkPendingInvitations(session.user.email);
  }

  return <ProfilePage initialSession={serializableSession} initialInvitations={pendingInvitations} />;
}