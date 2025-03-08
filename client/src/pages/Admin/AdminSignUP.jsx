import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { SignUp } from "@clerk/clerk-react";

function AdminSignup() {
  return (
    <div className="min-h-screen bg-blue-950">
      <nav className="h-16 px-6 flex items-center">
        <Link
          to="/admin/login"
          className="text-white hover:text-orange-300 transition-colors duration-300 flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Homepage
        </Link>
      </nav>

      <div className="flex justify-center items-center px-4 py-12">
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardHeader className="space-y-1 text-center bg-orange-500 rounded-t-lg text-white py-6">
            <CardTitle className="text-2xl font-bold">Admin Signup</CardTitle>
            <p className="text-sm text-orange-100">
              Create your BiteBox admin account
            </p>
          </CardHeader>

          <CardContent className="p-6">
            <SignUp
              routing="path"
              path="/admin/signup"
              signInUrl="/admin/login"
              redirectUrl="/admin/dashboard"
              appearance={{
                elements: {
                  formButtonPrimary: "bg-blue-950 hover:bg-blue-800",
                  footerAction: "text-blue-950 hover:text-blue-800",
                },
              }}
            />
          </CardContent>

          <CardFooter className="px-6 py-4 bg-gray-50 border-t flex flex-col items-center text-center rounded-b-lg space-y-2">
            <p className="text-sm text-gray-600">
              This signup is for authorized administrators only.
            </p>
            <p className="text-xs text-gray-500">
              © 2025 BiteBox. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default AdminSignup;
