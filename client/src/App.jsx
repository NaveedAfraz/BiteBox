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
import useAuth from "./hooks/auth/useAuth";
import OrderConfirmation from "./components/OrderConfirmation";
import UserStatus from "./helper/userStatus";
import Orders from "./pages/Orders";
const Nav = () => {
  // console.log("...");
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavBar />
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
  // console.log(user);

  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate();
  const { loginAuth, useLoggedIn, signupAuth } = useAuth();
  const { data: loggedInData, refetch: refetchLoggedIn } = useLoggedIn(user?.primaryEmailAddress?.emailAddress);

  useEffect(() => {
    //console.log(loggedInData);
    // if (loggedInData) { 

    // }
  }, [loggedInData])
  console.log(user);

  const location = useLocation();
  useEffect(() => {
    const userRole = user?.unsafeMetadata?.role;
    // setRole(userRole);
    console.log(userRole);
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
  // if (!isLoaded && !user?.id) return <div>Loading user data...</div>;

  return (
    <>
      <RoleSelectionModal isOpen={isModalOpen} onRoleSelect={handleRoleSelect} setIsModalOpen={setIsModalOpen} />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        <Route path="/sso-callback" element={<OAuthCallback />} />
        <Route
          path="/admin/dashboard"
          element={<UserStatus loggedInData={loggedInData}>

          </UserStatus>}>
          <Route path="/admin/dashboard" element={<AdminHome />}> </Route>
        </Route >

        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/sign-up" element={<Signup />}></Route>


        <Route element={<Nav />}>
          <Route path="/" element={<UserStatus loggedInData={loggedInData} />} >
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/orders/:id" element={<Orders />} />
            <Route path="/menu" element={<Menu />} />
            {/* <Route path="/checkout" element={<PaymentPage />} /> */}
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
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
          </Route>
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes >
    </>
  );
}

export default App;
