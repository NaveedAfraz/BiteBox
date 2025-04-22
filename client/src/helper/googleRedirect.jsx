import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useAuth from "@/hooks/auth/useAuth";

function OAuthCallback() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { loginAuth, useLoggedIn } = useAuth();
  const [hasProcessed, setHasProcessed] = useState(false);

  const { data: loggedInData, isLoading: isLoggedInLoading } = useLoggedIn(
    user?.primaryEmailAddress?.emailAddress
  );
  console.log(loggedInData, "loggedInData");
  console.log(user, "user");
  console.log(isLoggedInLoading, "isLoggedInLoading");
  
  useEffect(() => {
    if (loginAuth.isSuccess) {
      navigate("/");
    }
  }, [loginAuth.isSuccess, navigate]);

  useEffect(() => {
    const handleSocialLogin = () => {
      if (isLoaded && user && !hasProcessed && !isLoggedInLoading) {
        setHasProcessed(true);

        console.log(user);

        const email = user.primaryEmailAddress?.emailAddress;
        const role = user.unsafeMetadata?.role || "customer";

        const formData = {
          email,
          role,
          isSocialLogin: true,
        };

        sessionStorage.setItem("selectedRole", role);

        if (!loggedInData || !loggedInData.email) {
          console.log("User not logged in, initiating login process");
          loginAuth.mutate({ formData });
        } else {
          console.log("User already logged in", loggedInData);
          navigate("/");
        }
      }
    };
    handleSocialLogin();
  }, [
    isLoaded,
    user,
    hasProcessed,
    loginAuth,
    loggedInData,
    isLoggedInLoading,
    navigate,
  ]);

  // Common loading/processing layout
  const LoadingIndicator = ({ message }) => (
    <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-lg font-semibold text-gray-700">{message}</p>
    </div>
  );

  if (isLoggedInLoading) {
    return <LoadingIndicator message="Checking login status..." />;
  }

  // Show processing indicator while login mutation or navigation occurs
  return <LoadingIndicator message="Processing your login..." />;
}

export default OAuthCallback;
