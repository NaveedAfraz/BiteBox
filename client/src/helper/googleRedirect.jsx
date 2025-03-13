import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useAuth from "@/hooks/auth/useAuth";

function OAuthCallback() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { loginAuth, useLoggedIn } = useAuth();
  const [hasProcessed, setHasProcessed] = useState(false);

  const { data: loggedInData, isLoading: isLoggedInLoading } = useLoggedIn(user?.primaryEmailAddress?.emailAddress);
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
          isSocialLogin: true
        };

        sessionStorage.setItem('selectedRole', role);

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
  }, [isLoaded, user, hasProcessed, loginAuth, loggedInData, isLoggedInLoading, navigate]);

  if (isLoggedInLoading) {
    return <div>Checking login status...</div>;
  }
  return <div>Processing your login...</div>;
}

export default OAuthCallback;