
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useCart = () => {


  const fetchCart = (userId) => {

    return useQuery({
      queryKey: ['cart', userId],
      queryFn: async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart/getCart/${userId}`);
        console.log(userId);
        return data.data;
      },
      enabled: !!userId,
      staleTime: 30000,
      refetchOnWindowFocus: true,
    });
  };


  const AddToCart = () => {
    return useMutation({
      mutationFn: async (cartItem) => {
        console.log(cartItem);
        const data = await axios.post(`${process.env.REACT_APP_API_URL}/api/cart/addItem`, cartItem);
        console.log(data);

        return data;
      },
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(['cart', variables.userId]);
      },
    });
  };


  const ReduceQuantity = () => {
    return useMutation({
      mutationFn: async (args) => {
        console.log(args);

        const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/deleteItem`, {
          data: args
        });
        console.log(data);

        return data;
      },
      onSettled: (_data, _error, variables) => {
        queryClient.invalidateQueries(['cart', variables.userId]);
      },
    });
  };

  return {
    fetchCart,
    AddToCart,
    ReduceQuantity,
  };
};

export default useCart;