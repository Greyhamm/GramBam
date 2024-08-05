"use client";

import { login } from "@/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [state, formAction] = useFormState<any, FormData>(login, undefined);
  const router = useRouter();

  const handleSignupRedirect = () => {
    router.push("/signup");
  };

  return (
    <div className="w-full max-w-xs form-container">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" action={formAction}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="text"
            name="email"
            required
            placeholder="Email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            required
            placeholder="Password"
          />
          {state?.error && <p className="text-red-500 text-xs italic">{state.error}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            onClick={handleSignupRedirect}
            type="button"
          >
            Sign Up
          </button>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">&copy;2024 Your Company. All rights reserved.</p>
    </div>
  );
};

export default LoginForm;
