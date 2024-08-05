import { getSession } from "@/actions"
import { redirect } from "next/navigation"

const ProfilePage = async () => {

    const session = await getSession()

    if(!session.isLoggedIn){
        redirect("/");
    }
    return (
        <div className="profile">
            <h1>
                Welcome to the profile page
            </h1>
            <p>Welcome, <b>{session.user?.username}</b></p>
        </div>
    );
};

export default ProfilePage