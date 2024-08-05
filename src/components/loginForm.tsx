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
    <div>
      <form action={formAction}>
        <input type="text" name="email" required placeholder="Email" />
        <input type="password" name="password" required placeholder="Password" />
        <button type="submit">Login</button>
        {state?.error && <p>{state.error}</p>}
      </form>
      <div>
        <button onClick={handleSignupRedirect}>Sign Up</button>
      </div>
    </div>
  );
};

export default LoginForm;
