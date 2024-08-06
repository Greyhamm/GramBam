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
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold mb-4 text-gray-900 ">Login</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-6 text-gray-700 sm:text-lg sm:leading-7">
                <form action={formAction}>
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="email"
                      name="email"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                      placeholder="Email address"
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Email Address
                    </label>
                  </div>
                  <div className="relative mt-6">
                    <input
                      autoComplete="off"
                      id="password"
                      name="password"
                      type="password"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-600"
                      placeholder="Password"
                      required
                    />
                    <label
                      htmlFor="password"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Password
                    </label>
                  </div>
                  {state?.error && (
                    <p className="text-red-500 text-xs italic mt-2">{state.error}</p>
                  )}
                  <div className="mt-6 flex justify-between">
                    <button
                      className="bg-blue-500 text-white rounded-md px-4 py-2"
                      type="submit"
                    >
                      Login
                    </button>
                    <button
                      className="text-blue-500 hover:text-blue-800 font-bold"
                      onClick={handleSignupRedirect}
                      type="button"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
              <p className="text-center text-gray-500 text-xs mt-6">
                &copy;2024 Your Company. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginForm;
