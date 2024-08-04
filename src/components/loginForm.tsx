import { login } from "@/actions"
const LoginForm = () => {
    return(
        <form action={login}>
            <input type="text" name="email" required placeholder="username"/>
            <input type="text" name="password" required placeholder="password"/>
            <button>Login</button>
        </form>
    )
}

export default LoginForm