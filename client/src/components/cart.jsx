import React from "react";

function Cart() {
  // Dummy cart data
  const cartItems = [
    {
      id: 1,
      restaurant: "Home Plate by EatFit",
      location: "Manikonda",
      items: [
        {
          id: 101,
          name: "Chicken Nihari Paratha Thali (Chicken)",
          price: 349,
          quantity: 1,
          isVeg: false,
          customizable: true,
        },
        {
          id: 102,
          name: "Paneer Butter Masala",
          price: 249,
          quantity: 2,
          isVeg: true,
          customizable: true,
        },
      ],
      image: "/api/placeholder/80/80",
    },
    {
      id: 2,
      restaurant: "The Burger Joint",
      location: "Hitech City",
      items: [
        {
          id: 201,
          name: "Classic Cheeseburger with Fries",
          price: 299,
          quantity: 1,
          isVeg: false,
          customizable: false,
        },
      ],
      image:
        "https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3",
    },
    {
      id: 3,
      restaurant: "The Burger Joint",
      location: "Hitech City",
      items: [
        {
          id: 301,
          name: "Classic Cheeseburger with Fries",
          price: 299,
          quantity: 1,
          isVeg: false,
          customizable: false,
        },
      ],
      image:
        "https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3",
    },
  ];

  // Calculate bill details
  const calculateSubtotal = () => {
    let total = 0;
    cartItems.forEach((restaurant) => {
      restaurant.items.forEach((item) => {
        total += item.price * item.quantity;
      });
    });
    return total;
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = 73;
  const platformFee = 6;
  const taxAndCharges = Math.round(subtotal * 0.14);
  const totalAmount = subtotal + deliveryFee + platformFee + taxAndCharges;

  return (
    <div className="shadow-md rounded-b-2xl p-2 md:rounded-bl-none bg-white md:rounded-r-2xl w-full max-w-xl z-[3] ">
      {/* Cart Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Your Cart</h2>
      </div>

      {/* Cart Items */}
      <div className="flex flex-col divide-y ">
        {cartItems.map((restaurant) => (
          <div key={restaurant.id} className="p-4">
            {/* Restaurant Info */}
            <div className="flex items-center mb-4">
              <img
                src={restaurant.image}
                alt={restaurant.restaurant}
                className="w-12 h-12 rounded-md mr-3"
              />
              <div>
                <h3 className="font-bold text-lg">{restaurant.restaurant}</h3>
                <p className="text-gray-600 text-sm">{restaurant.location}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-4 ml-2">
              {restaurant.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {item.isVeg ? (
                        <span className="inline-block w-4 h-4 border border-green-600 mr-2">
                          <span className="block w-2 h-2  bg-green-600 m-auto rounded-full"></span>
                        </span>
                      ) : (
                        <span className="inline-block w-4 h-4 border border-red-600 mr-2">
                          <span className="block w-2 h-2 bg-red-600 m-auto rounded-full"></span>
                        </span>
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex border rounded">
                      <button className="px-2 py-1 text-lg cursor-pointer">
                        −
                      </button>
                      <span className="px-3 py-1 border-l border-r">
                        {item.quantity}
                      </span>
                      <button className="px-2 py-1 text-lg text-green-600 cursor-pointer">
                        +
                      </button>
                    </div>
                    <div className="text-right min-w-16">
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
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
            <span>₹{deliveryFee}</span>
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
            <span>₹{platformFee}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span>GST and Restaurant Charges</span>
            </div>
            <span>₹{taxAndCharges}</span>
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
        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200 cursor-pointer">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default Cart;
