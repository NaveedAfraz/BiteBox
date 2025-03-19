import React, { useActionState, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Input } from "./ui/input";
import { LogIn, Search } from "lucide-react";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { useSelector } from "react-redux";

function NavBar() {
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();
  const { userId } = useAuth();
 // console.log(userId);
  const { userInfo } = useSelector(state => state.auth)
 // console.log(userInfo, "....");

  useEffect(() => {
  //  console.log("rendering...");

  }, [])
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-white shadow-md ">
        <div onClick={() => navigate("/")} className="text-3xl font-bold text-red-500 cursor-pointer">
          BiteBox
        </div>
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
          <div className="flex items-center gap-2">
            <button onClick={() => setShowSearch(true)}>
              <FaSearch className="text-xl text-gray-700 hover:text-red-500 cursor-pointer transition-colors" />
            </button>
            <FaShoppingCart
              className="text-xl text-gray-700 hover:text-red-500 cursor-pointer transition-colors "
              onClick={() => navigate(`/checkout?userid=${userInfo.userId}`)}
            />
          </div>
          {/* <FaUser className="text-xl text-gray-700 hover:text-red-500 cursor-pointer transition-colors" /> */}
          <UserButton />
          {!userId && (
            <>
              <div className="flex gap-2 items-center justify-center">
                <Link to="/login" className="font-bold text-lg">
                  Login
                </Link>
                <LogIn />
              </div>
            </>
          )}
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
