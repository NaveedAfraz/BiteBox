import Address from "@/components/address";
import Cart from "@/components/cart";
import React from "react";

function Checkout() {
  return (
    <div className="min-h-screen">
      <div className="flex-grow mt-24">Checkout</div>
      <div className="flex-grow flex mt-10 bg-amber-700 h-[100vh] ">
        <Address />
        <Cart />
      </div>
    </div>
  );
}

export default Checkout;
