import React from "react";
import { Link, useNavigate } from "react-router";
import { Mail } from "lucide-react";
import CustomLoginForm from "../helper/customForm"; // adjust if needed
import { UserButton, useUser } from "@clerk/clerk-react";
import AnimatedWelcomeText from "../components/admin/AnimatedWelcomeText";
function Login() {
  const welcomeText = "Welcome Back To BiteBox!";
  const navigate = useNavigate();
  const { user } = useUser();
  console.log(user);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setStep((prev) => {
  //       if (prev >= welcomeText.length) {
  //         if (!isResetting) {
  //           setIsResetting(true);
  //           setTimeout(() => {
  //             setStep(0);
  //             setIsResetting(false);
  //           }, 2000);
  //         }
  //         return prev;
  //       }
  //       return prev + 1;
  //     });
  //   }, 200);

  //   return () => clearInterval(interval);
  // }, [isResetting, welcomeText]);

  return (
    <div>
      <div className="flex-grow mt-15">
     
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-white shadow-md">
          <h1
            className="text-3xl text-red-500 font-bold cursor-pointer"
            onClick={() => navigate("/")}
          >
            BiteBox
          </h1>
          {!user && (
            <span className="flex gap-5">
              <Link
                to="/sign-up"
                className="text-black hover:text-orange-300 transition-colors duration-300 flex items-center gap-2 font-medium"
              >
                Sign Up <Mail className="h-5 w-5" />
              </Link>
            </span>
          )}
          {user && <UserButton />}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-4rem)]">
         
          <div className="hidden lg:flex bg-white text-center justify-center items-center p-8">
            <div className="max-w-lg">
              <AnimatedWelcomeText text={welcomeText} />
              <p className="mt-6 text-teal-950 text-lg">
                Sign in to order amazing food from local restaurants in your area.
              </p>
            </div>
          </div>

    
          <div className="flex items-center justify-center p-6 bg-white">
            <div className="w-full max-w-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-blue-950 lg:hidden">
                {welcomeText}
              </h2>
              <CustomLoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
