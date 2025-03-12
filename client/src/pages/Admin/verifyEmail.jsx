import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const { signUp, setActive } = useSignUp();
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      // Verify the email
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      if (result.status === "complete") {
        // Activate the session
        await setActive({ session: result.createdSessionId });
        navigate("/"); // Redirect to home after successful verification
      } else {
        console.log("Verification not complete:", result);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Verify Email</h2>

        <form onSubmit={handleVerify} className="flex flex-col">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            required
            className="border border-gray-300 rounded p-2 mb-3 text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Verify Email
          </button>
        </form>

        {/* Back Button */}
        <button
          onClick={() => navigate("/sign-up")}
          className="mt-3 w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400 transition"
        >
          Back to Signup
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;
