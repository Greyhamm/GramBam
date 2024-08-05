import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex max-h-screen flex-col items-center justify-center p-8 bg-white dark:bg-gray-900">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Grambam
        </h1>
        <div className="flex space-x-4 justify-center">
          <Link href="/login" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800">
            Login
          </Link>
          <Link href="/signup" className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300">
            Sign Up
          </Link>
        </div>
      </div>

      <div className="relative mb-8">
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
    </main>
  );
}
