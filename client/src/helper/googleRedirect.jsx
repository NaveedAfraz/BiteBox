import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import useAuth from "@/hooks/auth/useAuth";

function OAuthCallback() {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  const { loginAuth, useLoggedIn, signupAuth } = useAuth();
  const [hasProcessed, setHasProcessed] = useState(false);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const { data: loggedInData, isLoading: isLoggedInLoading } = useLoggedIn(userEmail);
  
  // Add timeout to prevent infinite waiting
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!user && isLoaded) {
        console.log("Timeout occurred waiting for user data");
        setTimeoutOccurred(true);
      }
    }, 5000); // 5 seconds timeout
    
    return () => clearTimeout(timeoutId);
  }, [user, isLoaded]);
  
  // Handle successful login/signup redirect
  useEffect(() => {
    if (loginAuth.isSuccess || signupAuth.isSuccess) {
      navigate("/");
    }
  }, [loginAuth.isSuccess, signupAuth.isSuccess, navigate]);
  
  // Redirect to login if timeout occurred
  useEffect(() => {
    if (timeoutOccurred) {
      console.log("Redirecting to login page due to timeout");
      navigate("/login?error=auth-timeout");
    }
  }, [timeoutOccurred, navigate]);
  
  // Handle social login processing
  useEffect(() => {
    const handleSocialLogin = async () => {
      // Check if the user is loaded and signed in
      if (!isLoaded) {
        return; // Still loading, wait
      }
      
      // If user is loaded but not signed in, redirect to login
      if (isLoaded && !isSignedIn && !clerk.isReady) {
        console.log("User not signed in after OAuth process");
        navigate("/login?error=auth-failed");
        return;
      }
      
      // Don't process if already processed
      if (hasProcessed) {
        return;
      }
  
      // Check if we have a user from Clerk
      if (user) {
        console.log("User found, processing social login");
        setHasProcessed(true);
        
        const email = user.primaryEmailAddress?.emailAddress;
        // Get role from session storage or default to customer
        const role = sessionStorage.getItem("selectedRole") || "customer";
        const username = user.username || 
                         user.firstName || 
                         'user' + Math.random().toString(36).substring(2, 8);
        
        // Prepare form data
        const formData = {
          email,
          role,
          username,
          isSocialLogin: true,
        };
        
        try {
          // Check if user exists in our system
          if (!loggedInData || !loggedInData.email) {
            console.log("Creating new user in system:", formData);
            signupAuth.mutate({ formData });
          } else {
            console.log("User exists, logging in:", formData);
            loginAuth.mutate({ formData });
          }
        } catch (error) {
          console.error("Error during social login processing:", error);
          navigate("/login?error=process-failed");
        }
      }
    };
    
    handleSocialLogin();
  }, [
    isLoaded,
    isSignedIn,
    user,
    hasProcessed,
    loginAuth,
    signupAuth,
    loggedInData,
    isLoggedInLoading,
    navigate,
    clerk.isReady
  ]);
  
  // Loading indicator component
  const LoadingIndicator = ({ message }) => (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
  
  // Show appropriate loading state
  if (!isLoaded) {
    return <LoadingIndicator message="Loading authentication data..." />;
  }
  
  if (isLoaded && !isSignedIn && !timeoutOccurred) {
    return <LoadingIndicator message="Waiting for authentication to complete..." />;
  }
  
  if (isLoggedInLoading) {
    return <LoadingIndicator message="Verifying account status..." />;
  }
  
  if (loginAuth.isLoading || signupAuth.isLoading) {
    return <LoadingIndicator message="Processing your account..." />;
  }
  
  if (hasProcessed) {
    return <LoadingIndicator message="Finalizing authentication..." />;
  }
  
  // Fallback loading state with a retry button
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p className="text-lg text-gray-600">Completing authentication...</p>
      <button 
        onClick={() => navigate("/login")}
        className="mt-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Return to Login
      </button>
    </div>
  );
}

export default OAuthCallback;