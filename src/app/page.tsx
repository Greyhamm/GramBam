import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-blue-900 text-white">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Grambam
        </h1>
        <div className="flex space-x-6 justify-center">
          <Link href="/login" className="px-8 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors duration-200 shadow-lg text-lg font-semibold">
            Login
          </Link>
          <Link href="/signup" className="px-8 py-3 bg-blue-700 text-white rounded-full hover:bg-blue-600 transition-colors duration-200 shadow-lg text-lg font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
      <div className="relative mb-8 bg-white p-6 rounded-lg shadow-lg">
        <Image
          src="/file.svg"
          alt="Grambam Logo"
          width={220}
          height={45}
          priority
        />
      </div>
    </main>
  );
}