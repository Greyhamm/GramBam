import LoginForm from "@/components/loginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col items-center justify-center max-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-bold text-center text-black mb-4">
          Login Page
        </h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
