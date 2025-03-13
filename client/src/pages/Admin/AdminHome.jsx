import React, { useState, useEffect } from "react";
import Dashboard from "./dashboard";
import MenuItems from "../../components/admin/menuItems";
import Requests from "../../components/admin/Requests";
import UserList from "@/components/admin/userlist";
import SpecialCard from "@/components/SpecialCard";
import { specialOffers } from "@/config/details";
import Messages from "@/components/admin/messages";
import OrderList from "@/components/admin/OrderList";
import Reviews from "../../components/admin/Reviews";
import ChartCircle from "@/components/admin/chart";
import Restaurants from "./Restaurants";
import { useAuth, UserButton } from "@clerk/clerk-react";
import { LogInIcon, LogOutIcon, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import {
  LayoutDashboard, UtensilsCrossed, FileText, Users, DollarSign,
  Tag, MessageSquare, Star, ShoppingBag, List
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
function AdminHome() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [userRole, setUserRole] = useState(user?.unsafeMetadata?.role);
  console.log(user);

  const [activeTab, setActiveTab] = useState(
    userRole === "admin" ? "dashboard" : "vendorDashboard"
  );
  const { userId } = useAuth();
  const navigate = useNavigate();

  // console.log(user, isLoaded, isSignedIn);

  useEffect(() => {
    setActiveTab(userRole === "admin" ? "dashboard" : "vendorDashboard");
  }, [userRole]);


  const [close, setClose] = useState(true);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setClose(true);
      } else {
        // alert("hk")
        setClose(false)
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [details, setDetails] = useState(null);
  useEffect(() => {
    if (user) {
      setDetails({
        Name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      });
    }
  }, [user])


  const superAdminItems = [
    { id: "dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { id: "restaurants", icon: <UtensilsCrossed />, label: "Restaurants" },
    { id: "vendorRequests", icon: <FileText />, label: "Vendor Requests" },
    { id: "users", icon: <Users />, label: "Users" },
    { id: "Revenue", icon: <DollarSign />, label: "Revenue" },
    { id: "promotions", icon: <Tag />, label: "Promotions" },
    { id: "messages", icon: <MessageSquare />, label: "Messages" },
    { id: "Reviews", icon: <Star />, label: "Reviews" },
  ];

  const vendorItems = [
    { id: "dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { id: "menuItems", icon: <List />, label: "Menu Items" },
    { id: "vendorOrders", icon: <ShoppingBag />, label: "Orders" },
    { id: "Revenue", icon: <DollarSign />, label: "Revenue" },
    { id: "Reviews", icon: <Star />, label: "Reviews" },
    { id: "messages", icon: <MessageSquare />, label: "Messages" },
  ];

  const accountItems = [
    {
      id: userId ? "Logout" : "Login",
      icon: userId ? <UserButton /> : <LogInIcon />,
      label: userId ? details?.Name : "Login",
    },
  ];

  // Choose sidebar items based on role
  const sidebarItems = userRole === "admin" ? superAdminItems : vendorItems;

  return (
    <div className="min-h-screen">
      <header className="shadow w-full">
        <div className="flex items-center px-6 py-4">
          <div className="border-b">
            <h1 className="text-xl font-bold text-red-500">BiteBox Admin</h1>
            <div className="mt-2 text-sm text-gray-600">
              Logged in as:{" "}
              <span className="text-md font-bold">
                {userRole === "admin" ? "Super Admin" : "Vendor"}
              </span>
            </div>
          </div>
          <div className="flex items-center absolute right-5">
            <UserButton />
            {!userId && (
              <div className="flex gap-3 ml-3 items-center justify-center">
                <Link to="/login" className="font-bold text-lg">
                  Login
                </Link>
                <LogInIcon />
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`h-full shadow-md transition-all duration-300 ${close ? "w-20 opacity-80" : "w-58"} md:${close ? "w-20" : "w-52"}`}
        >
          <nav className={`p-4 bg-amber-50 ${close ? "w-20" : "w-58"}`}>
            <div className="flex items-center m-1 flex-wrap">
              <button
                className="p-2 rounded-md hover:bg-red-100 transition duration-300 ml-0.5"
                onClick={() => setClose((prev) => !prev)}
              >
                {close ? (
                  <Menu className="h-5 w-5" />
                ) : (
                  <X className="h-5 w-5" />
                )}
              </button>
            </div>
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 font-semibold py-2 text-md rounded-md ${activeTab === item.id
                      ? "bg-red-100"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className={`${close ? "hidden" : "block"}`}>
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mt-6 mb-2">
              Account
            </p>
            <ul className="space-y-1">
              {accountItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.label == "Login") {
                        setActiveTab(item.id);
                        if (userId) {
                          // navigate("/logout");
                        } else {
                          navigate("/login");
                        }
                      }
                    }}
                    disabled={item.icon && item.label !== "Login"}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md 
                   ${item.icon && item.label !== "Login" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className={`${close ? "hidden" : "block"}`}>
                      <span className="font-bold">{item.label ? item.label : "Name Not Provided"}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full overflow-auto">

          <main className="p-6">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "menuItems" && <MenuItems />}
            {activeTab === "restaurants" && <Restaurants />}
            {activeTab === "vendorRequests" && <Requests />}
            {activeTab === "users" && <UserList />}
            {activeTab === "promotions" && <SpecialCard specialOffers={specialOffers} />}
            {activeTab === "messages" && <Messages />}
            {activeTab === "vendorOrders" && <OrderList />}
            {activeTab === "Reviews" && <Reviews />}
            {activeTab === "Revenue" && <ChartCircle />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
