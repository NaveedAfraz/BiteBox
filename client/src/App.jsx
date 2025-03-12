import React from "react";
import "./App.css";
import { Routes, Route, Outlet } from "react-router";
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
import { useAuth, useUser } from "@clerk/clerk-react";
import ProtectedRoute from "./helper/protectRoute";
import AdminHome from "./pages/Admin/AdminHome";
import Restaurant from "./pages/Restaurant";
import VerifyEmail from "./pages/Admin/verifyEmail";
function App() {
  const { userId } = useAuth();
  const { user, isLoaded, updateUserMetadata } = useUser();
  const Nav = () => {
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
  // console.log(userId);
  if (!isLoaded) return <div>Loading user data...</div>;
  console.log(user);
  let idd = "123"
  const handleUpdate = async () => {
    try {
      // Use the update method on the user object
      await user.update({
        publicMetadata: {
          role: "customer",
        },
      });
      console.log("User metadata updated successfully");
    } catch (error) {
      console.error("Error updating metadata:", error);
    }
  };

  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route
          path="/admin/dashboard"
          element={

            <AdminHome />

          }
        ></Route>

        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route path="/sign-up" element={<Signup />}></Route>

        <Route path="/" element={<Nav />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu" element={<Menu />} />
          <Route
            path="/restaurant"
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
      </Routes>
      <button
        onClick={() => {
          user?.update({
            unsafeMetadata: { idd },
          })
        }}
      >
        Update birthday
      </button>
    </>
  );
}

export default App;
