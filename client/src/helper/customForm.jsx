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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const location = useLocation();
  const { toggleAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { loginAuth } = useAuth();
  const { user, updateUserMetadata } = useUser();

  useEffect(() => {
    if (location.pathname === "/login") {
      dispatch(toggleAuthState("Login"));
    } else {
      dispatch(toggleAuthState("Sign Up"));
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
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

        if (result.status === "missing_requirements") {
          if (result.unverifiedFields.includes("email_address")) {
            await signUp.prepareEmailAddressVerification();
            navigate("/verify-email");
          }
        } else if (result.status === "complete") {
          if (result.createdSessionId) {
            navigate("/");
          }
        }
      } else {
        // Handle Login
        const result = await signIn.create({
          identifier: email,
          password: password,

        });
        console.log(result);

        const user = result.user || result.createdSessionId?.user;
        const userRole = user?.unsafeMetadata?.role;
        // console.log(user, userRole);

        // await updateUserMetadata({ role: "customer" });
        if (userRole !== role) {
          await signIn.reload();
          throw new Error("Role mismatch - use correct account type");
        }
        // try {
        //   // Update auth state with user data
        //   loginAuth.mutate({ user });
        // } catch (error) {
        //   console.log(error);
        // }
      }
    } catch (err) {
      console.log(err)
      setError(err.errors ? err.errors[0].message : err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isSignInLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
      });
    } catch (err) {
      setError(err.message || "An error occurred with Google sign-in");
    }
  };

  if (!isSignUpLoaded || !isSignInLoaded) {
    return <div>Loading authentication system...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow"
    >
      <h2 className="text-2xl font-bold mb-4">{toggleAuth}</h2>

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

      {
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

      <button
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 p-2 rounded hover:bg-gray-50 mt-2"
        disabled={processing}
      >
        <FcGoogle className="text-xl" />
        <span>Sign in with Google</span>
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
  );
}

export default CustomSignUpForm;