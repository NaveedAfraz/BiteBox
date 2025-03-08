import React, { useEffect, useState } from "react";
import { SignUp } from "@clerk/clerk-react";
import { Link } from "react-router"; // Fixed import path
import { LogIn } from "lucide-react";

function Signup() {
  const welcomeText = "Welcome to BiteBox!";
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

  return (
    <div className="flex-grow mt-15">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-white shadow-md">
        <h1 className="text-3xl  text-red-500 font-bold">BiteBox</h1>
        <Link
          to="/login"
          className="text-black hover:text-orange-300 transition-colors duration-300 flex items-center gap-2 font-medium"
        >
          Login <LogIn className="h-5 w-5" />
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-4rem)]">
        <div className="hidden lg:flex bg-white  text-center justify-center items-center p-8">
          <div className="max-w-lg">
            <h1 className="text-4xl lg:text-5xl text-teal-950 font-bold">
              {welcomeText.slice(0, step)}
              <span className="animate-pulse">|</span>
            </h1>
            <p className="mt-6 text-teal-950 text-lg">
              Sign up today and discover amazing food from local restaurants in
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
              <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/login"
                fallbackRedirectUrl="/admin/dashboard"
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
  );
}

export default Signup;
