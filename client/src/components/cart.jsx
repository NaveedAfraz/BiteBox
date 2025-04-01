import useItemQuantity from "@/hooks/Restaurant/useItemQuantity";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Cart({ cart, selectedAddress, refetch }) {
  const { userInfo } = useSelector((state) => state.auth)
  const { handleAdd, handleReduce, cartItems } = useItemQuantity();
  // console.log(cartItems);
  // console.log(userInfo);
  console.log(cart);

  useEffect(() => {
    refetch()
  }, [cartItems?.items])

  // const [searchparams] = useSearchParams() 
  // const userid = searchparams.get('ID')  
  // console.log(userInfo);
  const calculateSubtotal = () => {
    let total = 0;
    if (cart?.items && cart.items.length > 0) {
      cart.items.forEach((item) => {
        total += item.amount * item.quantity;
      });
    }
    return total;
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Sample order data: update with your actual order details
  const subtotal = calculateSubtotal();
  console.log(subtotal);
  console.log(selectedAddress);

  const deliveryFee = 73;
  const platformFee = 6;
  const taxAndCharges = Math.round(subtotal * 0.14);
  const taxAmount = deliveryFee + platformFee + taxAndCharges;
  const totalAmount = subtotal + deliveryFee + platformFee + taxAndCharges;

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    const orderData = {
      items: cart?.items?.map((item) => {
        console.log(item.quantity);
        return {
          name: item.name || item.title,
          itemID: item.itemID,
          quantity: item.quantity,
          price: item.price || item.amount,
          currency: "USD"
        };
      })
    };
    //console.log(orderData);

    try {
      // Create a PayPal order on your backend
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/create-paypal-order`,
        { IDs: { userID: userInfo.userId, cartID: cart.cartId, restaurantID: cartItems.items[0].restaurantID, addressID: selectedAddress }, orderData: orderData.items, amount: subtotal, taxAmount: taxAmount },
        { withCredentials: true }
      );

      console.log(response);
      localStorage.setItem("orderID", response.data.dbOrderID);
      localStorage.setItem("paypalOrderID", response.data.orderId);
      localStorage.setItem("cartID", cart.cartId);
      // The backend returns the orderId and approvalUrl
      const { approvalUrl } = response.data;
      if (approvalUrl) {
        // Redirect the user to the PayPal approval page
        window.location.href = approvalUrl;
      } else {
        throw new Error("No approval URL returned from PayPal");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Error creating PayPal order");
      setIsProcessing(false);
    }
  };
 

  return (
    <div className="shadow-md rounded-b-2xl p-2 md:rounded-bl-none bg-white md:rounded-r-2xl w-full max-w-xl z-[3] ">

      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Your Cart</h2>
      </div>


      <div className="flex flex-col divide-y ">
        {cart?.items?.length > 0 && cart?.items?.map((item) => (
          <div key={item.id || item.itemID} className="p-4">

            <div className="flex items-center mb-4">
              <img
                src={item.img}
                alt={item.title}
                className="w-12 h-12 rounded-md mr-3"
              />
              <div>
                <h3 className="font-bold text-lg">{item.title || item.name}</h3>
              </div>
            </div>

            <div className="flex flex-col space-y-4 ml-2">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    {item.foodType === "Veg" ? (
                      <span className="inline-block w-4 h-4 border border-green-600 mr-2">
                        <span className="block w-2 h-2 bg-green-600 m-auto rounded-full"></span>
                      </span>
                    ) : (
                      <span className="inline-block w-4 h-4 border border-red-600 mr-2">
                        <span className="block w-2 h-2 bg-red-600 m-auto rounded-full"></span>
                      </span>
                    )}
                    <span className="font-medium">{item.foodType || "Non-Veg"}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex border rounded">
                    <button
                      className="px-2 py-1 text-lg cursor-pointer"
                      onClick={() => handleReduce(item.itemID || item.id)}
                    >
                      −
                    </button>
                    <span className="px-3 py-1 border-l border-r">
                      {item.quantity}
                    </span>
                    <button
                      className="px-2 py-1 text-lg text-green-600 cursor-pointer"
                      onClick={() => handleAdd(item)}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-16">
                    <span>₹{item.amount * item.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No-contact Option */}
      <div className="p-4 border-t">
        <label className="flex items-start cursor-pointer">
          <input type="checkbox" className="mt-1 mr-3" />
          <div>
            <p className="font-medium text-gray-800">
              Opt in for No-contact Delivery
            </p>
            <p className="text-sm text-gray-600">
              Unwell, or avoiding contact? Please select no-contact delivery.
              Partner will safely place the order outside your door (not for
              COD)
            </p>
          </div>
        </label>
      </div>

      {/* Bill Details */}
      <div className="p-4 border-t">
        <h3 className="font-bold mb-3">Bill Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Item Total</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span>Delivery Fee | 6.5 kms</span>
              <button className="ml-2 text-gray-500 rounded-full"></button>
            </div>
            <span>₹{deliveryFee || 49}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Tip</span>
            <button className="text-red-500 font-medium">Add tip</button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span>Platform fee</span>
              <button className="ml-2 text-gray-500 rounded-full"></button>
            </div>
            <span>₹{platformFee || 4}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span>GST and Restaurant Charges</span>
            </div>
            <span>₹{taxAndCharges || 68}</span>
          </div>
        </div>

        <div className="my-4 border-t pt-4">
          <div className="flex justify-between font-bold">
            <span>TO PAY</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      <div className="p-4 border-t">
        <button
          className={`w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg ${!selectedAddress ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer transition duration-200 hover:bg-red-600"
            }`}
          disabled={!selectedAddress}
          onClick={handleCheckout}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default Cart;