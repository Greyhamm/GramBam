import { logout } from "@/actions"

const LogoutForm = () => {
    return (
        <form action={logout}>
            <button>Loggout</button>
        </form>
    )
}

export default LogoutForm