import { setOrderIDs } from '@/store/restaurant';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';

// Base API URL
const BASE_URL = `${process.env.REACT_APP_API_URL}`;

const useOrders = (restaurantId) => {
  const queryClient = useQueryClient();
  // Mutation for updating order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      console.log(orderId, status);

      if (!['delivered', 'rejected'].includes(status)) {
        console.log("rrrrrr");
        throw new Error('Status must be either "approved" or "rejected"');
      }


      const response = await axios.put(
        `${BASE_URL}/api/orders/${orderId}/status/${status}`,
        { status }
      );
      console.log(response);

      return response.data;
    },
    // onSuccess: () => {
    //   // Invalidate and refetch orders after a successful update
    //   queryClient.invalidateQueries({ queryKey: ['orders', restaurantId] });
    // }
  });

  // Helper functions that use the mutation
  const updateOrderStatus = (orderId, status) => {
    return updateOrderStatusMutation.mutate({ orderId, status });
  };




  const approveOrder = ({ orderId, status }) => {
    console.log(orderId, status);

    return updateOrderStatus(orderId, status);
  };

  const rejectOrder = ({ orderId, status }) => {
    console.log(orderId, status);

    return updateOrderStatus(orderId, status);
  };


  const dispatch = useDispatch();
  const fetchOrders = (userId) => useQuery({
    queryKey: ['userOrders', userId],
    queryFn: async () => {
      console.log(userId);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/fetchUserOrders/${userId}`);
      console.log(response);

      const sortedOrders = response.data.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );
      // Get recent order IDs for the store
      const recentOrderIds = sortedOrders.slice(0, 5).map((order) => order.orderID);
      console.log(recentOrderIds);
      dispatch(setOrderIDs(recentOrderIds));
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    fetchOrders,
    updateOrderStatus,
    approveOrder,
    rejectOrder
  };
};

export default useOrders;