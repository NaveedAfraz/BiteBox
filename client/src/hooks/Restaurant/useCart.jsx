import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const useCart = () => {
  const queryClient = useQueryClient();

  const useCartQuery = (userId) => {
    return useQuery({
      queryKey: ['cart', userId],
      queryFn: async () => {
        const { data } = await axios.get(`/api/cart/${userId}`);
        return data.data;
      },
      enabled: !!userId,
      staleTime: 30000,
      refetchOnWindowFocus: true,
    });
  };


  const useAddToCartMutation = () => {
    return useMutation({
      mutationFn: async (cartItem) => {
        const { data } = await axios.post('/api/cart/add', cartItem);
        return data;
      },
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(['cart', variables.userId]);
      },
    });
  };


  const useReduceQuantityMutation = () => {
    return useMutation({
      mutationFn: async (params) => {
        const { data } = await axios.post('/api/cart/reduce', params);
        return data;
      },
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(['cart', variables.userId]);
      },
    });
  };

  return {
    useCartQuery,
    useAddToCartMutation,
    useReduceQuantityMutation,
  };
};

export default useCart;