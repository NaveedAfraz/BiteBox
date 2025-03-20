import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Input } from "./ui/input";
import { LogIn, Menu, Search, X } from "lucide-react";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";

function NavBar() {
  const [showSearch, setShowSearch] = useState(false);
  
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { userInfo } = useSelector(state => state.auth);
  const id = userInfo?.userId;
  
  const NavLinks = () => (
    <>
      <Link to="/" className="block py-2 text-gray-700 hover:text-red-500 transition-colors">Home</Link>
      <Link to="/menu" className="block py-2 text-gray-700 hover:text-red-500 transition-colors">Menu</Link>
      <Link to="/about" className="block py-2 text-gray-700 hover:text-red-500 transition-colors">About</Link>
      <Link to="/contact" className="block py-2 text-gray-700 hover:text-red-500 transition-colors">Contact</Link>
      {id && <Link to={`/orders/${id}`} className="block py-2 text-gray-700 hover:text-red-500 transition-colors">Orders</Link>}
    </>
  );

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-5 py-4 bg-white shadow-md">
        <div className="flex items-center">
          {/* Mobile Menu (only visible on small screens) */}
          <div className="block md:hidden mr-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-8">
                <div className="py-4 flex flex-col space-y-4">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Logo */}
          <div onClick={() => navigate("/")} className="text-2xl md:text-3xl font-bold text-red-500 cursor-pointer">
            BiteBox
          </div>
        </div>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <NavLinks />
        </div>
        
        {/* Right Side Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setShowSearch(true)} className="p-1">
            <FaSearch className="text-lg md:text-xl text-gray-700 hover:text-red-500 cursor-pointer transition-colors" />
          </button>
          
          <button 
            onClick={() => navigate(`/checkout?userid=${userInfo?.userId}`)} 
            className="p-1"
          >
            <FaShoppingCart className="text-lg md:text-xl text-gray-700 hover:text-red-500 cursor-pointer transition-colors" />
          </button>
          
          {userId ? (
            <div className="ml-1">
              <UserButton />
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-gray-700 hover:text-red-500"
              onClick={() => navigate("/login")}
            >
              <span className="hidden sm:inline font-medium">Login</span>
              <LogIn className="h-5 w-5" />
            </Button>
          )}
        </div>
      </nav>
      
      {/* Search Overlay */}
      {showSearch && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-start justify-center pt-20"
          onClick={() => setShowSearch(false)}
        >
          <div 
            className="w-[90%] max-w-2xl bg-white p-4 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex items-center">
              <Input 
                placeholder="Search..." 
                name="search" 
                autoFocus 
                className="w-full pr-10" 
              />
              <div className="absolute right-3 flex">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
            </div>
            <div className="mt-2 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-4 w-4 mr-1" />
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;