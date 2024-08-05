"use client";

import { signup } from "@/actions";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

const SignupForm = () => {
    const [state, formAction] = useFormState<any, FormData>(signup, undefined);
    const router = useRouter();
  
    const handleSignupRedirect = () => {
      router.push("/login");
    };
  return (
    <div>
    <form action={formAction}>
      <input type="text" name="username" required placeholder="Username" />
      <input type="email" name="email" required placeholder="Email" />
      <input type="password" name="password" required placeholder="Password" />
      <button>Signup</button>
      {state?.error && <p>{state.error}</p>}
      <div>
        <button onClick={handleSignupRedirect}>Login</button>
      </div>
    </form>
    </div>
  );
};

export default SignupForm;
