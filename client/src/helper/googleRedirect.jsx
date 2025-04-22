import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useAuth from "@/hooks/auth/useAuth";

function OAuthCallback() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { loginAuth, useLoggedIn } = useAuth();
  const [hasProcessed, setHasProcessed] = useState(false);
  
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  
  const { data: loggedInData, isLoading: isLoggedInLoading } = useLoggedIn(userEmail);
  
  // Handle successful login redirect
  useEffect(() => {
    if (loginAuth.isSuccess) {
      navigate("/");
    }
  }, [loginAuth.isSuccess, navigate]);
  
  // Handle social login processing
  useEffect(() => {
    // Only process if user is loaded, not already processed, and login check completed
    if (isLoaded && user && !hasProcessed && !isLoggedInLoading) {
      setHasProcessed(true);
      
      const email = user.primaryEmailAddress?.emailAddress;
      const role = user.unsafeMetadata?.role || "customer";
      
      // Store selected role for future use
      sessionStorage.setItem("selectedRole", role);
      
      // If user not already logged in, initiate login process
      if (!loggedInData || !loggedInData.email) {
        loginAuth.mutate({ 
          formData: {
            email,
            role,
            isSocialLogin: true
          }
        });
      } else {
        // User already logged in, redirect to home
        navigate("/");
      }
    }
  }, [isLoaded, user, hasProcessed, loginAuth, loggedInData, isLoggedInLoading, navigate]);
  
  // Loading indicator component
  const LoadingIndicator = ({ message }) => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
  
  // Show appropriate loading state
  if (isLoggedInLoading) {
    return <LoadingIndicator message="Checking login status..." />;
  }
  
  if (loginAuth.isLoading || hasProcessed) {
    return <LoadingIndicator message="Processing your login..." />;
  }
  
  // Fallback loading state for initial render
  return <LoadingIndicator message="Initializing..." />;
}

export default OAuthCallback;