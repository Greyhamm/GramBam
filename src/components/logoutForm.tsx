"use client";
import { logout } from "@/actions";
import { useRouter } from "next/navigation";

const LogoutForm = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 text-sm font-medium"
    >
      Logout
    </button>
  );
};

export default LogoutForm;