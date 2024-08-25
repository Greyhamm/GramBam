import { getSession } from "@/actions";
import ProfilePage from "@/components/profilePage";

export default async function ProfilePageWrapper() {
  const session = await getSession();
  
  // Extract only serializable data from the session
  const serializableSession = {
    isLoggedIn: session.isLoggedIn,
    userId: session.user?.id,
    username: session.user?.username,
  };

  return <ProfilePage initialSession={serializableSession} />;
}
