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
function App() {
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
        <Route path="/" element={<Nav />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
