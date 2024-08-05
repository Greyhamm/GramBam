import SignupForm from "@/components/signupForm"

const SignupPage = () => {

    return (
        <div className="flex flex-col items-center justify-center max-h-screen">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h1 className=" text-xl font-bold text-center text-black mb-4">
              Signup Page
            </h1>
            <SignupForm />
          </div>
        </div>
      );
    };
export default SignupPage