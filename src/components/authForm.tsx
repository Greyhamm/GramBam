"use client";
import React, { useState } from 'react';
import { login, signup } from "@/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginState, loginFormAction] = useFormState<any, FormData>(login, undefined);
  const [signupState, signupFormAction] = useFormState<any, FormData>(signup, undefined);
  const router = useRouter();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="wrapper min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card-switch w-96">
        <label className="switch">
          <input type="checkbox" className="toggle" checked={!isLogin} onChange={toggleForm} />
          <span className="slider"></span>
          <span className="card-side"></span>
          <div className={`flip-card__inner ${isLogin ? '' : 'rotate-y-180'}`}>
            <div className="flip-card__front bg-white p-8 rounded-lg shadow-md">
              <div className="title text-2xl font-bold mb-6">Log in</div>
              <form className="flip-card__form" action={loginFormAction}>
                <input className="flip-card__input" name="email" placeholder="Email" type="email" required />
                <input className="flip-card__input" name="password" placeholder="Password" type="password" required />
                {loginState?.error && <p className="text-red-500 text-sm">{loginState.error}</p>}
                <button className="flip-card__btn" type="submit"></button>
              </form>
            </div>
            <div className="flip-card__back bg-white p-8 rounded-lg shadow-md">
              <div className="title text-2xl font-bold mb-6">Sign up</div>
              <form className="flip-card__form" action={signupFormAction}>
                <input className="flip-card__input" name="username" placeholder="Username" type="text" required />
                <input className="flip-card__input" name="email" placeholder="Email" type="email" required />
                <input className="flip-card__input" name="password" placeholder="Password" type="password" required />
                {signupState?.error && <p className="text-red-500 text-sm">{signupState.error}</p>}
                <button className="flip-card__btn" type="submit">Confirm!</button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default AuthForm;