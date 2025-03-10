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


function AdminHome() {
  const [userRole, setUserRole] = useState("super_ admin");
  const [activeTab, setActiveTab] = useState(
    userRole === "super_admin" ? "dashboard" : "vendorDashboard"
  );

  // When role changes, set the default tab accordingly
  useEffect(() => {
    if (userRole === "super_admin") {
      setActiveTab("dashboard");
    } else {
      setActiveTab("vendorDashboard");
    }
  }, [userRole]);

  // Define menu items for each role as an array of objects
  const superAdminItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "restaurants", icon: "🍽️", label: "Restaurants" },
    { id: "vendorRequests", icon: "📝", label: "Vendor Requests" },
    { id: "users", icon: "👥", label: "Users" },
    { id: "Revenue", icon: "💰", label: "Revenue" },
    { id: "promotions", icon: "🏷️", label: "Promotions" },
    { id: "messages", icon: "💬", label: "Messages" },
    { id: "Reviews", icon: "⭐", label: "Reviews" },
  ];

  const vendorItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "menuItems", icon: "🍔", label: "Menu Items" },
    { id: "vendorOrders", icon: "🛍️", label: "Orders" },
    { id: "Revenue", icon: "💰", label: "Revenue" },
    { id: "Reviews", icon: "⭐", label: "Reviews" },
  ];

  const accountItems = [
    { id: "logout", icon: "🚪", label: "Logout" },
  ];

  // Choose the main sidebar items based on the user role
  const sidebarItems = userRole === "super_admin" ? superAdminItems : vendorItems;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-white shadow-md">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-red-500">BiteBox Admin</h1>
            <div className="mt-2 text-sm text-gray-600">
              Logged in as:{" "}
              <span className="text-md font-bold">
                {userRole === "super_admin" ? "Super Admin" : "Vendor"}
              </span>
            </div>
          </div>

          <nav className="p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Main
            </p>
            <ul className="space-y-1">
              {sidebarItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 font-semi-bold py-2 text-md rounded-md ${activeTab === item.id
                      ? "bg-red-100"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
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
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${activeTab === item.id
                      ? "bg-red-100 text-red-700"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow">
            <div className="flex justify-between items-center px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {sidebarItems.find((item) => item.id === activeTab)?.label ||
                  "Dashboard"}
              </h2>
              <div className="flex items-center">
                <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                  🔔
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </button>
                <img
                  src="/api/placeholder/32/32"
                  alt="Profile"
                  className="w-8 h-8 rounded-full ml-4"
                />
              </div>
            </div>
          </header>

          <main className="p-6">
            {/* based on vender or owner i need to pass the details from res of api currecnly is it hardcoced and for admin and vendor same component is used just data is different */}

            {/* for some of the compononts only vendor can see and vice versa */}
            {/* <p>{`Currently active tab: ${activeTab}`}</p> */}
            {activeTab === "dashboard" && <Dashboard />} {/* for admin and vendor*/}

            {activeTab === "menuItems" && <MenuItems />} {/* for vendor */}
            {activeTab === "restaurants" && <Restaurants />} {/* for admin */}
            {activeTab === "vendorRequests" && <Requests />} {/* for admin */}
            {activeTab === "users" && <UserList />} {/* for admin */}
            {activeTab === "promotions" && <SpecialCard specialOffers={specialOffers} />} {/* for admin and vendor */}
            {activeTab === "messages" && <Messages />} {/* for admin*/}
            {activeTab === "vendorOrders" && <OrderList />} {/* for vendor */}
            {activeTab === "Reviews" && <Reviews />} {/* for vendor and admin */}
            {activeTab === "Revenue" && <ChartCircle />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminHome
