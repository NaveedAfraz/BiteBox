import React, { useEffect, useState } from "react";
import { useSignUp, useSignIn, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthState } from "@/store/auth";
import useAuth from "@/hooks/auth/useAuth";

function CustomSignUpForm() {
  const { signUp, setActive, isLoaded: isSignUpLoaded } = useSignUp();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const navigate = useNavigate();
  const { loginAuth, useLoggedIn, signupAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("customer"); // Set default role
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { data: loggedInData, isLoading, refetch: refetchLoggedIn } = useLoggedIn(email);
  const location = useLocation();
  const { toggleAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { user } = useUser();

  // Set auth state based on path
  useEffect(() => {
    if (location.pathname === "/login") {
      dispatch(toggleAuthState("Login"));
    } else {
      dispatch(toggleAuthState("Sign Up"));
    }
  }, [location.pathname, dispatch]);

  // Check user authentication when email changes
  useEffect(() => {
    const checkUserAuthentication = async () => {
      if (email) {
        try {
          await refetchLoggedIn();
        } catch (error) {
          console.error("Error checking authentication:", error);
        }
      }
    };
    
    checkUserAuthentication();
  }, [email, refetchLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (username.trim().length === 0) {
      setError("Please enter username");
      return;
    }
    
    setProcessing(true);
    
    try {
      if (toggleAuth !== "Login") {
        // Handle Sign Up
        const result = await signUp.create({
          emailAddress: email,
          password: password,
          unsafeMetadata: { role },
        });
        
        const formData = {
          email,
          password,
          role,
          username,
        };

        if (result.status === "missing_requirements") {
          if (result.unverifiedFields.includes("email_address")) {
            await signUp.prepareEmailAddressVerification();
            navigate("/verify-email");
          }
        } else if (result.status === "complete") {
          if (result.createdSessionId) {
            await setActive({ session: result.createdSessionId });
            signupAuth.mutate({ formData });
            navigate("/");
          }
        }
      } else {
        // Handle Login
        if (!loggedInData || !loggedInData.email) {
          setError("Account not found. Please sign up first.");
          setProcessing(false);
          return;
        }
        
        const result = await signIn.create({
          identifier: email,
          password: password,
        });
        
        const formData = {
          email,
          password,
          role,
          username,
        };

        if (result.status === "complete") {
          sessionStorage.setItem('selectedRole', role);
          await setActive({ session: result.createdSessionId });
          loginAuth.mutate({ formData });
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      
      if (err.message?.includes("verification strategy is not valid")) {
        setError("This email was registered with a social account. Please sign in with Google using this email.");
      } else {
        setError(err.errors ? err.errors[0].message : err.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isSignInLoaded) return;
    
    try {
      // Store role selection
      sessionStorage.setItem('selectedRole', role || 'customer');
      
      // Start the OAuth flow
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/sso-callback",
      });
    } catch (err) {
      setError(err.message || "An error occurred with Google sign-in");
    }
  };

  if (!isSignUpLoaded || !isSignInLoaded) {
    return <div>Loading authentication system...</div>;
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-4">{toggleAuth}</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={processing}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={processing}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={processing}
        />

        <select
          className="w-full border p-2 mb-4 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={processing}
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={processing}
        >
          {processing ? "Processing..." : toggleAuth}
        </button>

        <p className="text-center mt-4">
          {toggleAuth !== "Login" ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              navigate(toggleAuth === "Login" ? "/sign-up" : "/login");
            }}
            className="text-blue-500 underline"
          >
            {toggleAuth === "Login" ? "Sign up" : "Login"}
          </button>
        </p>
      </form>
      <button
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 p-2 rounded hover:bg-gray-50 mt-2"
        disabled={processing}
      >
        <FcGoogle className="text-xl" />
        <span>Sign in with Google</span>
      </button>
    </>
  );
}

export default CustomSignUpForm;