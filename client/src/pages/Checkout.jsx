import Address from "@/components/address";
import Cart from "@/components/cart";
import React from "react";

function Checkout() {
  return (
    <div className="relative min-h-screen mt-24">
      {/* Background image covers the full container */}
      <div
        className="absolute inset-0 bg-cover z-[2] w-[95%] bg-center bg-no-repeat blur-xl opacity-40 "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3')",
          transform: "scale(1.1)",
        }}
      />

      {/* White overlay */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-[-1]" />

      {/* Content container */}
      <div className="flex md:flex-row flex-col mt-8 mb-3.5">
        <Address />
        <br></br>
        <Cart />
      </div>
    </div>
  );
}

export default Checkout;
