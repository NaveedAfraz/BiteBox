import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OrderConfirmation = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const capturePayment = async () => {
      const orderId = localStorage.getItem("orderID");
      const paypalOrderID = localStorage.getItem("paypalOrderID");
      const cartID = localStorage.getItem("cartID");
      // console.log('Order ID:', orderId);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/capture-paypal-order?orderId=${orderId}&paypalID=${paypalOrderID}&cartID=${cartID}`
        );
        console.log(response);

        setOrderDetails(response.data.orderDetails);
      } catch (err) {
        console.error("Error capturing payment:", err);
        setError("Failed to process your payment. Please contact support.");
      } finally {
        setIsLoading(false);
      }
    };

    capturePayment();
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="ml-4 text-lg font-semibold">Processing your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 text-center">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600 mb-4">
              Something Went Wrong
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-6">{error}</p>
            <Button onClick={() => navigate("/checkout")} variant="destructive">
              Return to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  localStorage.removeItem("orderID");
  localStorage.removeItem("paypalOrderID");
  localStorage.removeItem("cartID");

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 px-4">
      <Card className="w-full max-w-lg p-8 text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            Thank You for Your Order!
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orderDetails && (
            <div className="order-details mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-lg mb-2">
                Order ID:{" "}
                <span className="font-semibold text-gray-700">
                  {orderDetails.id}
                </span>
              </p>
              <p className="text-lg mb-2">
                Status:{" "}
                <span className="font-semibold text-green-600">Paid</span>
              </p>
              <p className="text-lg">
                Payment Date:{" "}
                <span className="font-semibold text-gray-700">
                  {new Date().toLocaleString()}
                </span>
              </p>
            </div>
          )}

          <p className="delivery-info text-gray-600 mb-8">
            Your food is being prepared and will be delivered shortly. You'll
            receive an email confirmation with your order details soon.
          </p>

          <div className="button-container flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="default"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto"
            >
              Return to Menu
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/orders")}
              className="w-full sm:w-auto"
            >
              View My Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderConfirmation;
