import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-white shadow-md">
      <div className="text-2xl font-bold text-red-500">BiteBox</div>
      <div className="hidden md:flex space-x-8">
        <Link
          to="/"
          className="text-gray-700 hover:text-red-500 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/menu"
          className="text-gray-700 hover:text-red-500 transition-colors"
        >
          Menu
        </Link>
        <Link
          to="/about"
          className="text-gray-700 hover:text-red-500 transition-colors"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="text-gray-700 hover:text-red-500 transition-colors"
        >
          Contact
        </Link>
      </div>
      <div className="flex gap-4">
        <FaSearch className="text-xl text-gray-700 hover:text-red-500 cursor-pointer transition-colors" />
        <FaShoppingCart className="text-xl text-gray-700 hover:text-red-500 cursor-pointer transition-colors" />
        <FaUser className="text-xl text-gray-700 hover:text-red-500 cursor-pointer transition-colors" />
      </div>
    </nav>
  );
}

export default NavBar;
