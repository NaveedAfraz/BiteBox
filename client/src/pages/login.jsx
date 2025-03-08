import React, { useEffect, useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router"; // Fixed import path
import { LogIn } from "lucide-react";

function Signup() {
  const welcomeText = "Welcome Back To BiteBox!";
  const [step, setStep] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= welcomeText.length) {
          if (!isResetting) {
            setIsResetting(true);
            setTimeout(() => {
              setStep(0);
              setIsResetting(false);
            }, 2000);
          }
          return prev;
        }
        return prev + 1;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isResetting]);
  const naviagte = useNavigate();
  return (
    <div>
      <div className="flex-grow mt-15">
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-white shadow-md">
          <h1
            className="text-3xl  text-red-500 font-bold cursor-pointer"
            onClick={() => naviagte("/")}
          >
            BiteBox
          </h1>
          <span className="flex gap-5">
            <Link
              to="/admin/login"
              className="hover:text-orange-300 transition-colors duration-300 flex items-center gap-2 font-bold p-1 px-3 rounded-lg text-black bg-gray-200 "
            >
              Admin
            </Link>
            <Link
              to="/sign-up"
              className="text-black hover:text-orange-300 transition-colors duration-300 flex items-center gap-2 font-medium"
            >
              Sign Up <LogIn className="h-5 w-5" />
            </Link>
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-4rem)]">
          <div className="hidden lg:flex bg-white  text-center justify-center items-center p-8">
            <div className="max-w-lg">
              <h1 className="text-4xl lg:text-5xl text-teal-950 font-bold">
                {welcomeText.slice(0, step)}
                <span className="animate-pulse">|</span>
              </h1>
              <p className="mt-6 text-teal-950 text-lg">
                Welcome Back!, Discover amazing food from local restaurants in
                your area.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 bg-white">
            <div className="w-full max-w-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-blue-950 lg:hidden">
                {welcomeText}
              </h2>
              <div className="bg-white rounded-lg p-4 shadow-lg flex items-center justify-center">
                <SignIn
                  routing="path"
                  path="/login"
                  signUpUrl="/sign-up"
                  fallbackRedirectUrl="/"
                  appearance={{
                    elements: {
                      formButtonPrimary: "bg-blue-950 hover:bg-blue-800",
                      footerAction: "text-blue-950 hover:text-blue-800",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
