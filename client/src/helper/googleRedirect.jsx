import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useAuth from "@/hooks/auth/useAuth";

function OAuthCallback() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { loginAuth, loggedIn } = useAuth();
  const [hasProcessed, setHasProcessed] = useState(false);

  // Set up a listener for loginAuth success if it's a mutation
  useEffect(() => {
    if (loginAuth.isSuccess) {
      // alert("Login")
      navigate("/");
    }
  }, [loginAuth.isSuccess, navigate]);

  useEffect(() => {
    const handleSocialLogin = () => {
      if (isLoaded && user && !hasProcessed) {
        // Set flag to prevent multiple executions
        setHasProcessed(true);

        console.log(user);

        // User has successfully authenticated with a social provider
        const email = user.primaryEmailAddress?.emailAddress;

        // Get user metadata or set defaults
        const role = user.unsafeMetadata?.role || "customer";

        // Create formData object similar to your regular login
        const formData = {
          email,
          role,
          // Note: No password for social logins
          isSocialLogin: true
        };

        // Store role in session
        sessionStorage.setItem('selectedRole', role);

        // Check if user details are already present in loggedIn query
        if (!loggedIn.data || !loggedIn.data.email) {
          console.log(loggedIn.data);
       
          loginAuth.mutate({ formData });
        }
      }
    };

    handleSocialLogin();
  }, [isLoaded, user, hasProcessed, loginAuth, loggedIn.data]);

  return <div>Processing your login...</div>;
}

export default OAuthCallback;
