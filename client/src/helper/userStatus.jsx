import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";
import { UserX, AlertTriangle, ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

const UserStatus = ({ loggedInData, children }) => {
  console.log(children);

  const { isLoaded } = useAuth();
  const [isBanned, setIsBanned] = useState(false);
 // console.log(loggedInData);

  useEffect(() => {
    // Check if the user is banned
    if (loggedInData === null || (loggedInData && loggedInData.role !== 'admin' && loggedInData.status !== 'active')) {
     //console.log(loggedInData);
      setIsBanned(true);
    } else {
      setIsBanned(false);
    }

  }, [loggedInData]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (isBanned) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full border border-red-100">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <UserX className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Account Suspended 🚫
          </h1>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
              <p className="text-amber-700">Your account has been banned from the platform</p>
            </div>
          </div>
          <p className="text-gray-600 text-center mb-6">
            We've detected activity that violates our terms of service. If you believe this is a mistake, please contact our support team.
          </p>
          <div className="space-y-4">
            <Link
              to="/contact"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center transition-colors duration-300"
            >
              Contact Support
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="w-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 py-2 px-4 rounded-md font-medium flex items-center justify-center transition-colors duration-300"
            >
              Login Page
              <LogIn className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  else {
    return <Outlet /> // Return null if user is not logged in or is not an admin
  }

};

export default UserStatus;