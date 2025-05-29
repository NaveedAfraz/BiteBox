import React, { useEffect, useState } from "react";
import { useSignUp, useSignIn, useUser, useClerk } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthState } from "@/store/auth";
import useAuth from "@/hooks/auth/useAuth";
import { toast } from "sonner";

function CustomSignUpForm() {
  const { signUp, setActive, isLoaded: isSignUpLoaded } = useSignUp();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const navigate = useNavigate();
  const { loginAuth, useLoggedIn, signupAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { data: loggedInData, isLoading, isError, error: loggedInError, refetch: refetchLoggedIn } = useLoggedIn(email);
  const location = useLocation();
  const { toggleAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { user } = useUser()
  // console.log(user, "ua");
  useEffect(() => {
    if (location.pathname === "/login") {
      dispatch(toggleAuthState("Login"));
    } else {
      dispatch(toggleAuthState("Sign Up"));
    }
  }, [location.pathname]);
  console.log(loggedInData);

  const checkUserAuthentication = async (email) => {
    try {
      await refetchLoggedIn();
      if (loggedInData) {
        console.log("User authenticated:", loggedInData);
        // You might want to set some state or perform some action based on this data
      } else {
        console.log("User not authenticated");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setError("Error checking authentication. Please try again.");
    }
  };

  useEffect(() => {
    if (email) {
      checkUserAuthentication(email);
    }
  }, [email, loggedInData]);

  // console.log(loggedInData);
  // const { signOut } = useClerk()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);


    if (email.trim().length === 0) return toast("Please enter email");
    if (password.trim().length === 0) return toast("Please enter password");

    setProcessing(true);
    try {
      if (toggleAuth !== "Login") {
        // Handle Sign Up
        console.log(role)
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
        }
        if (result.status === "missing_requirements") {
          if (result.unverifiedFields.includes("email_address")) {
            await signUp.prepareEmailAddressVerification();
            navigate("/verify-email");
          }
        } else if (result.status === "complete") {
          if (result.createdSessionId) {
            toast("login success")  // never works cuz verfiy email is mandatory
            signUp.mutate({ formData })
            navigate("/");
          }
        }
      } else {
        // Handle Login
        if (!loggedInData && !loggedInData?.email && !user) {
          toast("Please sign up")
          // await signOut({ redirectUrl: '/login' });
          // loginAuth.mutate({ formData });
          return;
        } else {
          const result = await signIn.create({
            identifier: email,
            password: password,
          });
          console.log(result);
          const formData = {
            email,
            password,
            role,
            username,
          }
          //  console.log(role);

          if (result.status === "complete") {
            sessionStorage.setItem('selectedRole', role);
            await setActive({ session: result.createdSessionId });
            // navigate("/"); 
          }
        }
      }
    } catch (signInErr) {
      console.log("Sign-in error: ", signInErr);
      if (signInErr.message?.includes("verification strategy is not valid")) {
        setError("This email was registered with a social account. Please sign in with Google using this email.");
      } else {
        setError(signInErr.errors ? signInErr.errors[0].message : signInErr.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleGoogleSignIn = async () => {
    toast("Google sign-in is not available for some time due to a bug. Please use email and password to sign in.");
    return;
    if (!isSignInLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        // redirectUrlComplete: "/",
      });
    } catch (err) {
      setError(err.message || "An error occurred with Google sign-in");
    }
  };
  console.log(location.pathname.split("/")[1]);

  // if (!isSignUpLoaded || !isSignInLoaded) {
  //   return <div>Loading authentication system...</div>;
  // }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-6 bg-white rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-4">{toggleAuth}</h2>
        {location.pathname.split("/")[1] == "sign-up" &&
          <input
            type="username"
            placeholder="Username"
            className="w-full border p-2 mb-4 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={processing}
          />
        }
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

        {location.pathname === "sign-up" &&
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
        }
        <div id="clerk-captcha" className="mb-4"></div>

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
              toggleAuth == "Login" ? navigate("/sign-up") : navigate("/login");
            }}
            className="text-blue-500 underline"
          >
            {toggleAuth == "Login" ? <p>Sign up</p> : <p>Login</p>}
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
