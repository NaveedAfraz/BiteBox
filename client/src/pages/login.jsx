import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { LogIn, Mail } from "lucide-react";
import CustomLoginForm from "../helper/customForm"; // Make sure this file exists
import { UserButton, useUser } from "@clerk/clerk-react";

function Login() {
  const welcomeText = "Welcome Back To BiteBox!";
  const [step, setStep] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser()
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
  }, [isResetting, welcomeText]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-white shadow-md">
        <h1
          className="text-3xl text-red-500 font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          BiteBox
        </h1>
        <div className="flex gap-5">
          {/* <Link
            to="/admin/login"
            className="hover:text-orange-300 transition-colors flex items-center gap-2 font-bold p-1 px-3 rounded-lg bg-gray-200 text-black"
          >
            Admin
          </Link> */}
          {!user && <Link
            to="/sign-up"
            className="text-black hover:text-orange-300 transition-colors flex items-center gap-2 font-medium"
          >
            Sign Up <Mail className="h-5 w-5" />
          </Link>}
          <UserButton />
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-4rem)]">
          {/* Left Side: Animated Welcome Text */}
          <div className="hidden lg:flex items-center justify-center p-8 bg-white">
            <div className="max-w-lg text-center">
              <h1 className="text-4xl lg:text-5xl text-teal-950 font-bold">
                {welcomeText.slice(0, step)}
                <span className="animate-pulse">|</span>
              </h1>
              <p className="mt-6 text-teal-950 text-lg">
                Sign in to order amazing food from local restaurants in your area.
              </p>
            </div>
          </div>

          {/* Right Side: Custom Login Form */}
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
