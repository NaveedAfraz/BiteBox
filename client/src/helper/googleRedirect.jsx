import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import useAuth from "@/hooks/auth/useAuth";

function OAuthCallback() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { signUp } = useClerk();
  const { loginAuth, useLoggedIn, signupAuth } = useAuth();
  const [hasProcessed, setHasProcessed] = useState(false);
  
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const { data: loggedInData, isLoading: isLoggedInLoading } = useLoggedIn(userEmail);
  
  // Handle successful login/signup redirect
  useEffect(() => {
    if (loginAuth.isSuccess || signupAuth.isSuccess) {
      navigate("/");
    }
  }, [loginAuth.isSuccess, signupAuth.isSuccess, navigate]);
  
  // Handle social login processing
  useEffect(() => {
    const handleSocialLogin = async () => {
      // Don't process if already processed or still loading
      if (!isLoaded || hasProcessed || isLoggedInLoading) {
        return;
      }
  
      // Check if we have a user from Clerk
      if (user) {
        setHasProcessed(true);
        
        const email = user.primaryEmailAddress?.emailAddress;
        // Get role from session storage or default to customer
        const role = sessionStorage.getItem("selectedRole") || "customer";
        const username = user.username || user.firstName || 
          'user' + Math.random().toString(36).substring(2, 8);
        
        // Prepare form data
        const formData = {
          email,
          role,
          username,
          isSocialLogin: true,
        };
        
        // Store selected role for future use
        sessionStorage.setItem("selectedRole", role);
        
        try {
          // Check if user exists in our system
          if (!loggedInData || !loggedInData.email) {
            console.log("New user, creating account");
            // Create user in our system
            await signupAuth.mutate({ formData });
          } else {
            console.log("User exists, logging in");
            // User already exists, just log them in
            loginAuth.mutate({ formData });
          }
        } catch (error) {
          console.error("Error during social login processing:", error);
          navigate("/login?error=social-login-failed");
        }
      } else {
        // No user from Clerk yet, but we don't want to redirect to login
        // as this may be part of the OAuth flow
        console.log("No Clerk user yet, waiting...");
      }
    };
    
    handleSocialLogin();
  }, [
    isLoaded,
    user,
    hasProcessed,
    loginAuth,
    signupAuth,
    loggedInData,
    isLoggedInLoading,
    navigate,
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
    return <LoadingIndicator message="Loading user data..." />;
  }
  
  if (isLoggedInLoading) {
    return <LoadingIndicator message="Checking login status..." />;
  }
  
  if (loginAuth.isLoading || signupAuth.isLoading || hasProcessed) {
    return <LoadingIndicator message="Processing your login..." />;
  }
  
  // Fallback loading state
  return <LoadingIndicator message="Completing authentication..." />;
}

export default OAuthCallback;