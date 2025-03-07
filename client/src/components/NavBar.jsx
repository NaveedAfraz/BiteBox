import React, { useActionState, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

function NavBar() {
  const [showSearch, setShowSearch] = useState(false);
  const [data, submitAction, isPending] = useActionState();
  return (
    <>
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
          <button onClick={() => setShowSearch(true)}>
            <FaSearch className="text-xl text-gray-700 hover:text-red-500 cursor-pointer transition-colors" />
          </button>
          <FaShoppingCart className="text-xl text-gray-700 hover:text-red-500 cursor-pointer transition-colors" />
          <FaUser className="text-xl text-gray-700 hover:text-red-500 cursor-pointer transition-colors" />
        </div>
      </nav>
      {showSearch && (
        <div
          className="absolute inset-x-0 top-0 z-[22]"
          tabIndex={0}
          onBlur={() => setShowSearch(false)}
        >
          <div className="mt-16 bg-white h-[20vh] transform transition-all duration-500 ease-out flex items-center justify-center z-[30] relative">
            <div className="w-[80%] relative flex items-center">
              <Input
                placeholder="Search..."
                name="search"
                autoFocus
                className="w-full"
              />
              <div className="absolute right-3">
                <Search />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
