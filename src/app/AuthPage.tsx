"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/loginForm";
import SignupForm from "@/components/signupForm";
import { revalidatePath } from "next/cache";


const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // Read the mode from the URL query parameter
    const mode = new URLSearchParams(window.location.search).get("mode");
    if (mode === "signup") {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, []);

  const toggleForm = () => {
    // Toggle between login and signup
    const newMode = isLogin ? "signup" : "login";
    setIsLogin(!isLogin);
    // Update the URL without refreshing the page
    revalidatePath('/?mode=${newMode}');
    
};

  return (
    <div className="auth">
      <h1>Welcome to the {isLogin ? "login" : "signup"} page</h1>
      {isLogin ? <LoginForm /> : <SignupForm />}
      <div className="toggle-container">
        <p>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleForm}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
