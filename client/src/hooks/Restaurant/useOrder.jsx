import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Base API URL
const BASE_URL = 'http://localhost:3006';

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

  const rejectOrder = ({orderId, status}) => {
    console.log(orderId, status);
    
    return updateOrderStatus(orderId, status);
  };

  return {

    updateOrderStatus,
    approveOrder,
    rejectOrder
  };
};

export default useOrders;