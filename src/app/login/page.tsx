import LoginForm from  "@/components/loginForm"

const LoginPage = async () => {

    return (
        <div className='login'>
            <h1>
                Welcome to the login page
            </h1>
            <LoginForm/>
        </div>
    )
}

export default LoginPage