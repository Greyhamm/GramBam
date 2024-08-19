import Link from "next/link";
import LogoutForm from "./logoutForm";
import { getSession } from "@/actions";

const Navbar = async () => {
  const session = await getSession();

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              Grambam
            </Link>
            <Link href="/" className="nav-link">
              Homepage
            </Link>
            <Link href="/company" className="nav-link">
              Companies
            </Link>
            <Link href="/profile" className="nav-link">
              Profile
            </Link>
          </div>
          <div>
            {!session.isLoggedIn ? (
              <Link href="/login" className="nav-link">
                Login/Signup
              </Link>
            ) : (
              <LogoutForm />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;