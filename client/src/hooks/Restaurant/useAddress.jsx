import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";

const useAddress = () => {

  const fetchAddress = ({ userID }) => useQuery({
    queryKey: ["address"],
    queryFn: async () => {
      try {
        const response = await axios(`http://localhost:3006/api/address/fetchAddresses/${userID}`)
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
        const response = await axios.post("http://localhost:3006/api/address/addAddress", addressData, {
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
        const response = await axios.delete(`http://localhost:3006/api/address/deleteAddress/${addressID}/${userID}`, {
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