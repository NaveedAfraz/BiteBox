import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const path = location.pathname.split('/');
  const userId = path[2];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 'paid':
      case 'completed':
      case 'delivered':
        return "bg-green-100 text-green-800 border-green-300";
      case 'cancelled':
        return "bg-red-100 text-red-800 border-red-300";
      case 'processing':
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3006/api/orders/fetchUserOrders/${userId}`
        );

        // Sort orders by date (newest first)
        const sortedOrders = response.data.sort((a, b) =>
          new Date(b.orderDate) - new Date(a.orderDate)
        );
        
        setOrders(sortedOrders);
        setError(null);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    }
  }, [userId]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Calculate order total from details array
  const calculateOrderTotal = (details) => {
    if (!details || !details.length) return 0;
    return details.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6 mt-20">
      <h1 className="text-3xl font-bold">Your Orders</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : error ? (
        <Card className="p-4 bg-red-50 text-red-800 border border-red-200">
          {error}
        </Card>
      ) : orders.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-lg text-gray-600">You haven't placed any orders yet.</p>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-4 pr-4">
            {orders.map((order) => (
              <Card
                key={order.orderID}
                className="p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">Order #{order.orderID}</h3>
                      <Badge
                        className={`${getStatusColor(order.status)} border`}
                      >
                        {order.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-500">
                      Placed on {formatDate(order.orderDate)}
                    </p>

                    {order.totalAmount && (
                      <p className="font-medium">
                        Total: {formatPrice(order.totalAmount)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="text-sm px-3 py-1 rounded-full border bg-gray-50">
                      Payment: <span className={order.paymentStatus === "paid" ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                        {order.paymentStatus}
                      </span>
                    </div>

                    {order.trackingNumber && (
                      <div className="text-sm">
                        Tracking: <span className="font-mono">{order.trackingNumber}</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => handleViewDetails(order)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order #{selectedOrder.orderID}</DialogTitle>
                <DialogDescription>
                  Placed on {formatDate(selectedOrder.orderDate)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Order Status Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Status</h4>
                    <Badge className={`mt-1 ${getStatusColor(selectedOrder.status)} border`}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Payment</h4>
                    <p className={`text-sm font-medium ${selectedOrder.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                      {selectedOrder.paymentStatus}
                    </p>
                  </div>
                  {selectedOrder.restaurantID && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Restaurant</h4>
                      <p className="text-sm">ID: {selectedOrder.restaurantID}</p>
                    </div>
                  )}
                  {selectedOrder.deliveryAddressID && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Delivery Address</h4>
                      <p className="text-sm">ID: {selectedOrder.deliveryAddressID}</p>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-2">Order Items</h4>
                  {!selectedOrder.details || selectedOrder.details.length === 0 ? (
                    <p className="text-sm text-gray-500">No item details available</p>
                  ) : (
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item ID</TableHead>
                            <TableHead className="text-right">Qty</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.details.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell>{item.itemID || item.id}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">{formatPrice(item.price || 0)}</TableCell>
                              <TableCell className="text-right">{formatPrice((item.price || 0) * item.quantity)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>

                {/* Order Total */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-lg">
                    {formatPrice(selectedOrder.totalAmount || calculateOrderTotal(selectedOrder.details) || 0)}
                  </span>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;