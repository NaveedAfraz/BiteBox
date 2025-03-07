import React from "react";
import "./App.css";
import { Routes, Route, Outlet } from "react-router";
import Home from "./pages/home";
import NavBar from "./components/NavBar";
import Footer from "./components/footer";
import About from "./pages/about";
import Contact from "./pages/contact";
function App() {
  const Nav = () => {
    return (
      <>
        <NavBar />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
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
        </Route>
      </Routes>
    </>
  );
}

export default App;
