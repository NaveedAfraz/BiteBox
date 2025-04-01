import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';


const OrderConfirmation = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const capturePayment = async () => {

      const orderId = localStorage.getItem('orderID')
      const paypalOrderID = localStorage.getItem("paypalOrderID")
      const cartID = localStorage.getItem('cartID')
      // console.log('Order ID:', orderId);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL
          }/api/capture-paypal-order?orderId=${orderId}&paypalID=${paypalOrderID}&cartID=${cartID}`);
        console.log(response);

        setOrderDetails(response.data.orderDetails);
      } catch (err) {
        console.error('Error capturing payment:', err);
        setError('Failed to process your payment. Please contact support.');
      } finally {
        setIsLoading(false);
      }
    };

    capturePayment();
  }, [location]);

  if (isLoading) {
    return <div className="loading">Processing your payment...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/checkout')}>Return to Checkout</button>
      </div>
    );
  }
  localStorage.removeItem('orderID')
  localStorage.removeItem("paypalOrderID")
  localStorage.removeItem('cartID')
  return (
    <div className="confirmation-container">
      <div className="success-icon">✓</div>
      <h1>Thank You for Your Order!</h1>

      {orderDetails && (
        <div className="order-details">
          <p>Order ID: <span>{orderDetails.id}</span></p>
          <p>Status: <span className="status-success">Paid</span></p>
          <p>Payment date: <span>{new Date().toLocaleString()}</span></p>
        </div>
      )}

      <p className="delivery-info">
        Your food is being prepared and will be ready shortly.
        You will receive an email confirmation with your order details.
      </p>

      <div className="button-container">
        <button className="primary-button" onClick={() => navigate('/')}>
          Return to Menu
        </button>
        <button className="secondary-button" onClick={() => navigate('/orders')}>
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;