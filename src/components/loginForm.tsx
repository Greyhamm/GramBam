"use client";

import { login } from "@/actions"
import { useFormState } from "react-dom"

const LoginForm = () => {

    const [state, formAction] = useFormState<any,FormData>(login, undefined);
    
    return(
        <form action={formAction}>
            <input type="text" name="email" required placeholder="username"/>
            <input type="text" name="password" required placeholder="password"/>
            <button>Login</button>
            {state?.error && <p>{state.error}</p>}
        </form>
    )
}

export default LoginForm