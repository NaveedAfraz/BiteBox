import { OrderDetailsDialog } from "@/components/orderDialog";
import { ReviewDialog } from "@/components/reviewDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import useOrders from "@/hooks/Restaurant/useOrder";
import useReviews from "@/hooks/Restaurant/useReview";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();
  const path = location.pathname.split('/');
  const userId = path[2];

  const { fetchOrders } = useOrders()
  const { data: orders, isLoading, isError, refetch: refetchOrders } = fetchOrders(userId);
  console.log(orders, "orders");

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

  const { addreview, deleteReview, fetchReviews, invalidateReviews } = useReviews();
  const { orderReviewItemID } = useSelector((state) => state.restaurant);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleReviewOrder = (order) => {
    setSelectedOrder(order);
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async (reviewData) => {
    addreview.mutate({
      restaurantId: reviewData.restaurantID,
      orderReviewItemID: reviewData.orderID,
      title: reviewData.title,
      comment: reviewData.comment,
      rating: reviewData.rating,
      userID: userInfo.userId,
      itemID: orderReviewItemID,
      orderID: reviewData.orderID
    }, {
      onSuccess: () => {
        // Optionally refetch orders to get updated review status
        refetchOrders();
      }
    });
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

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6 mt-20">
      <h1 className="text-3xl font-bold">Your Orders</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : isError ? (
        <Card className="p-4 bg-red-50 text-red-800 border border-red-200">
          {error}
        </Card>
      ) : orders?.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-lg text-gray-600">You haven't placed any orders yet.</p>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-4 pr-4">
            {orders?.map((order) => (
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
                        onClick={() => {
                          handleViewDetails(order);
                          invalidateReviews();
                        }}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        View Details
                      </Button>

                      {/* Review button only for delivered orders */}
                      {order.status.toLowerCase() === 'delivered' && (
                        <Button
                          onClick={() => handleReviewOrder(order)}
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          Add Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Order Details Dialog - Using the separate component */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        reviewOpen={setReviewDialogOpen}
      />

      <ReviewDialog
        order={selectedOrder}
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default Orders;