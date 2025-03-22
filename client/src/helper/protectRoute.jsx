import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, UserX, AlertTriangle, ArrowRight, LogIn } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import useAuth from "@/hooks/auth/useAuth";

function ProtectedRoute({ children }) {
  // const { userId, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const navigate = useNavigate();
  //  console.log(userId);

  // Assuming these are custom hooks you've created
  const { loginAuth, useLoggedIn, signupAuth } = useAuth();
  const { data: loggedInData, refetch: refetchLoggedIn } =
    useLoggedIn(user?.primaryEmailAddress?.emailAddress);
  console.log(loggedInData);

  // Check if the user is banned when loggedInData changes
  useEffect(() => {
    if (loggedInData) {
      // Check if the user is banned
      if (loggedInData.role !== 'admin' && loggedInData.status !== 'active') {
        setIsBanned(true);
      } else {
        setIsBanned(false);
      }
    }
  }, [loggedInData]);

  // Loading state
  if (!userLoaded) {

    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // Not logged in state
  if (!loggedInData?.userId && !userLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <Lock className="mx-auto h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Access Restricted 🔒
          </h2>
          <div className="bg-blue-50 p-4 rounded-md flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Please log in to access this page
            </p>
          </div>
          <p className="text-center text-gray-600">
            This content is protected. Sign in to your account to view this page
            and unlock all features ✨
          </p>
          <div className="flex flex-col space-y-3 pt-2">
            <Link
              to="/signin"
              className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/signup"
              className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ArrowRight className="h-4 w-4" />
              <span>Create Account 🚀</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Banned user state
  if (isBanned) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <UserX className="mx-auto h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Account Suspended 🚫
          </h2>
          <div className="bg-red-50 p-4 rounded-md flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              Your account has been banned from the platform
            </p>
          </div>
          <p className="text-center text-gray-600">
            We've detected activity that violates our terms of service. If you believe this is a mistake, please contact our support team.
          </p>
          <div className="flex flex-col space-y-3 pt-2">
            <Link
              to="/support"
              className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ArrowRight className="h-4 w-4" />
              <span>Contact Support</span>
            </Link>
            <Link
              to="/signin"
              className="flex items-center justify-center space-x-2 w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Login Page</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;