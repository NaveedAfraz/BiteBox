import React, { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, Outlet, useNavigate, useLocation } from "react-router";
import Home from "./pages/home";
import NavBar from "./components/NavBar";
import Footer from "./components/footer";
import About from "./pages/about";
import Contact from "./pages/contact";
import Menu from "./pages/menu";
import Restaurants from "./pages/Restaurant";
import Checkout from "./pages/Checkout";
import Login from "./pages/login";
import Signup from "./pages/SignUP";
import AdminLogin from "./pages/Admin/adminLogin";
import AdminSignup from "./pages/Admin/AdminSignUP";
import { useUser } from "@clerk/clerk-react";
import ProtectedRoute from "./helper/protectRoute";
import AdminHome from "./pages/Admin/AdminHome";
import Restaurant from "./pages/Restaurant";
import VerifyEmail from "./pages/Admin/verifyEmail";
import RoleSelectionModal from "./components/admin/RoleSelectionModal";
import OAuthCallback from "./helper/googleRedirect";
import OrderConfirmation from "./components/OrderConfirmation";
import Orders from "./pages/Orders";
import MessageDashboard from "./pages/messagesDashboard";
import MessagesDashboard from "./pages/messagesDashboard";
import useAuth from "./hooks/auth/useAuth";
import { initializeSocket } from "./lib/socket";
import { Analytics } from "@vercel/analytics/react";
const Nav = ({ showSearch, setShowSearch }) => {
  // console.log("...");  

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavBar showSearch={showSearch} setShowSearch={setShowSearch} />
        <div className="flex-grow ">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );
};

function App() {
  // const { userId } = useAuth();
  const { user, isLoaded, updateUserMetadata } = useUser();
  console.log(user, "user");

  useEffect(() => {
    //let userId = "756"; // Replace with actual user ID logic
    let randomUserId = Math.floor(Math.random() * 10)
    const socket = initializeSocket(randomUserId);
    console.log(socket);

    if (!socket) {
      console.error("Socket not initialized!");
      return;
    }
    console.log("Socket instance:", socket);
    socket.on("connect", () => console.log("Socket connected:", socket.id));

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);
  const [showSearch, setShowSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate();
  const { loginAuth, useLoggedIn, signupAuth } = useAuth();
  const { data: loggedInData, refetch: refetchLoggedIn, isLoading } = useLoggedIn(user?.primaryEmailAddress?.emailAddress);
  console.log(loggedInData);

  const location = useLocation();
  useEffect(() => {
    const userRole = user?.unsafeMetadata?.role;
    // setRole(userRole);
    console.log(userRole, "role");
    // dispatch(userRole)
    if (userRole === "admin") {
      sessionStorage.removeItem('selectedRole');
      navigate("/admin/dashboard");
    } else if (userRole === "customer" && location.pathname === "/") {
      sessionStorage.removeItem('selectedRole');
      navigate("/");
    } else if (userRole === "vendor") {
      sessionStorage.removeItem('selectedRole');
      navigate("/admin/dashboard");
    }
  }, [user?.unsafeMetadata])


  useEffect(() => {
    const updateUserRole = async () => {
      // Get the selected role from sessionStorage
      const selectedRole = sessionStorage.getItem('selectedRole');

      if (isLoaded && user && selectedRole && !user.unsafeMetadata) {
        try {
          await user.update({
            unsafeMetadata: { role: selectedRole }
          });
          //   console.log("Updated user role to:", selectedRole);
          sessionStorage.removeItem('selectedRole');
        } catch (error) {
          console.error("Failed to update user role:", error);
        }
      }
      else if (isLoaded && user && (!user.unsafeMetadata || !user.unsafeMetadata.role)) {
        //   console.log("role already");
        setIsModalOpen(true);
      }
    };
    updateUserRole();
  }, [user, isLoaded]);

  // console.log(user);
  const handleRoleSelect = async (role) => {
    try {
      await user.update({ unsafeMetadata: { role } });
      // setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };
  // if (!isLoaded ) return <div>Loading user data...</div>;

  return (
    <>
      <Analytics /> 
      <RoleSelectionModal isOpen={isModalOpen} onRoleSelect={handleRoleSelect} setIsModalOpen={setIsModalOpen} />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        <Route path="/sso-callback" element={<OAuthCallback />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }>
        </Route >

        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/sign-up" element={<Signup />}></Route>


        <Route element={<Nav showSearch={showSearch} setShowSearch={setShowSearch} />}>
          {/* <Route path="/" element={<UserStatus loggedInData={loggedInData} />} > */}
          <Route path="/" element={<Home setShowSearch={setShowSearch} showSearch={showSearch} />} />
          <Route path="/about" element={<About />} />
          <Route path="/orders/:id" element={<Orders />} />
          <Route path="/menu" element={<Menu />} />
          {/* <Route path="/checkout" element={<PaymentPage />} /> */}
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/messagesDashboard" element={
            <ProtectedRoute>
              <MessagesDashboard />
            </ProtectedRoute>} />

          <Route
            path="/restaurant?/:name"
            element={
              <ProtectedRoute>
                <Restaurant />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* </Route> */}
      </Routes >
    </>
  );
}

export default App;
