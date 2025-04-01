import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

const useAddress = () => {

  const fetchAddress = ({ userID }) => useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      try {
        const response = await axios(`${import.meta.env.VITE_API_URL
          }/api/address/fetchAddresses/${userID}`)
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error)
      }
    },
    refetchInterval: 60 * 1000 * 5,
    retry: 1,
    staleTime: 60 * 1000 * 10,
    cacheTime: 60 * 1000 * 30,
  })

  const addAddress = useMutation({

    mutationFn: async ({ addressData }) => {
      console.log(addressData);
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL
          }/api/address/addAddress`, addressData, {
          withCredentials: true,
        })
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  })
 
  const removeAddress = useMutation({
    mutationFn: async ({ addressID, userID }) => {
      console.log(addressID, userID);

      try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL
          }/api/address/deleteAddress/${addressID}/${userID}`, {
          withCredentials: true,
        })
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  })
  return { fetchAddress, addAddress, removeAddress }
}

export default useAddress