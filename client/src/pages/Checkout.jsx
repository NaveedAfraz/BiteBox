import Address from "@/components/address";
import Cart from "@/components/cart";
import useCart from "@/hooks/Restaurant/useCart";
import useItemQuantity from "@/hooks/Restaurant/useItemQuantity";
import React, { useState } from "react";
import { useSearchParams } from "react-router";

function Checkout() {
  const [searchParams] = useSearchParams()
  const userid = searchParams.get('userid')
  const [selectedAddress, setSelectedAddress] = useState(false);

  const { fetchCart } = useCart()

  const { data: cart, isLoading, error, refetch } = fetchCart(userid)
  console.log(cart);


  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p>Add items to your cart to proceed to checkout.</p>
      </div>
    );
  }



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


      <div className="flex md:flex-row flex-col mb-3.5 items-center md:items-stretch justify-center">
        <Address
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          userid={userid}
        />
        <Cart cart={cart} selectedAddress={selectedAddress} refetch={refetch} />
      </div>
    </div>
  );
}

export default Checkout;
