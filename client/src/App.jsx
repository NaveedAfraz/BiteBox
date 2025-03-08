import React from "react";
import "./App.css";
import { Routes, Route, Outlet } from "react-router";
import Home from "./pages/home";
import NavBar from "./components/NavBar";
import Footer from "./components/footer";
import About from "./pages/about";
import Contact from "./pages/contact";
import Menu from "./pages/menu";
import Restaurants from "./pages/Restaurants";
import Checkout from "./pages/Checkout";
import Login from "./pages/login";
import Signup from "./pages/SignUP";
import AdminLogin from "./pages/Admin/adminLogin";
import AdminSignup from "./pages/Admin/AdminSignUP";
import DashBoard from "./pages/Admin/dashboard";
import { useAuth } from "@clerk/clerk-react";
import ProtectedRoute from "./helper/protectRoute";
function App() {
  const { userId } = useAuth();
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
  return (
    <>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        ></Route>

        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Signup />}></Route>
        
        <Route path="/" element={<Nav />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu" element={<Menu />} />
          <Route
            path="/restaurants"
            element={
              <ProtectedRoute>
                <Restaurants />
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
    </>
  );
}

export default App;
