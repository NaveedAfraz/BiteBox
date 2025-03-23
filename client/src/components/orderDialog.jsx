import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Loader2, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { orderReviewItem } from "@/store/restaurant";
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
import useReviews from '@/hooks/Restaurant/useReview';

// Order Details Dialog Component
export const OrderDetailsDialog = ({ order, open, onClose, reviewOpen }) => {
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
  const path = location.pathname.split('/');
  const userId = path[2];

  // Calculate order total from details array
  const calculateOrderTotal = (details) => {
    if (!details || !details.length) return 0;
    return details.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };
  console.log(order);
  const dispatch = useDispatch();
  const { fetchReviews } = useReviews();
  const { data: reviewsData, refetch } = fetchReviews({ restaurantId: order?.restaurantID, userID: Number(userId), orderID: order?.orderID });
  useEffect(() => {
    if (order?.orderID) {
      refetch();
    }
  }, [order?.orderID, refetch]);
  useEffect(() => {
    if (order?.orderID) {
      refetch();
    }
  }, [order?.orderID, refetch]);
  console.log(reviewsData);
  const ids = order?.details.map((item) => item.itemID || []);
  //console.log(ids);
 // console.log(reviewsData?.data.filter((review) => ids.includes(review.itemID)))
 // console.log(order?.details)
  useEffect(() => {

  }, [ids])
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle>Order #{order.orderID}</DialogTitle>
              <DialogDescription>
                Placed on {formatDate(order.orderDate)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Order Status Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <Badge className={`mt-1 ${getStatusColor(order.status)} border`}>
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Payment</h4>
                  <p className={`text-sm font-medium ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                    {order.paymentStatus}
                  </p>
                </div>
                {order.restaurantID && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Restaurant</h4>
                    <p className="text-sm">ID: {order.restaurantID}</p>
                  </div>
                )}
                {order.deliveryAddressID && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Delivery Address</h4>
                    <p className="text-sm">ID: {order.deliveryAddressID}</p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                {!order.details || order.details.length === 0 ? (
                  <p className="text-sm text-gray-500">No item details available</p>
                ) : (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item ID</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          {order.paymentStatus === "paid" && <TableHead className="text-right">Review</TableHead>}
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.details.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.itemID || item.id}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatPrice(item.price || 0)}</TableCell>
                            {order.paymentStatus === "paid" &&
                              <TableCell className="text-right">
                                {reviewsData?.data.some(review => review.itemID === (item.itemID)) ? (
                                  <div className="flex items-center justify-end gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span>
                                      {reviewsData.data.find(review => review.itemID === (item.itemID)).rating || "N/A"}
                                    </span>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      reviewOpen(true)
                                      dispatch(orderReviewItem(item.itemID || item.id))
                                    }}                                  >
                                    Add Review
                                  </Button>
                                )}
                              </TableCell>
                            }
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
                  {formatPrice(order.totalAmount || calculateOrderTotal(order.details) || 0)}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={onClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog >
  );
};