import React from "react";
import { Link } from "react-router";
import { Lock, AlertTriangle, ArrowRight } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

function ProtectedRoute({ children }) {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (userId) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border border-indigo-100">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <Lock className="h-10 w-10 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Access Restricted 🔒
        </h1>

        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-amber-700">Please log in to access this page</p>
          </div>
        </div>

        <p className="text-gray-600 text-center mb-6">
          This content is protected. Sign in to your account to view this page
          and unlock all features ✨
        </p>

        <div className="space-y-4">
          <Link
            to="/login"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center transition-colors duration-300"
          >
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>

          <Link
            to="/sign-up"
            className="w-full bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 py-2 px-4 rounded-md font-medium flex items-center justify-center transition-colors duration-300"
          >
            Create Account 🚀
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
