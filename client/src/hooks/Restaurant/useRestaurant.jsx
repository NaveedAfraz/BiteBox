import { setMenuItems } from "@/store/restaurant";
import { Mutation, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";

const useRestaurant = () => {
  const dispatch = useDispatch()
  const Add_Adresses = useMutation({
    mutationFn: async ({ formData, restaurantData }) => {
      console.log(formData, restaurantData);
      let api;
      if (formData.role == "vendor") {
        api = "http://localhost:3006/api/restaurant/AddrestaurantAndAddresses"
      } else {
        api = "http://localhost:3006/api/restaurant/customeraddresses"
      }

      try {
        const response = await axios.post(api, {
          Name: restaurantData.Name,
          PhoneNumber: restaurantData.PhoneNumber,
          Cuisine: restaurantData.Cuisine,
          OpeningHours: restaurantData.OpeningHours,
          ClosingHours: restaurantData.ClosingHours,
          state: formData.state,
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          building: formData.building,
          additionalInfo: formData.additionalInfo,
          addressType: formData.addressType,
          email: formData.email,
          image: restaurantData.ImageUrl
        }, {
          withCredentials: true,
        });
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  })

  const fetchRestaurant = ({ userID }) => useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      console.log(userID);
      try {
        const response = await axios.get(`http://localhost:3006/api/restaurant/fetchRestaurant/${userID}`, {
          withCredentials: true,
        });
        console.log(response);
        dispatch(setMenuItems(response.data.items))
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!userID
  })

  const fetchAllRestaurant = () => useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {

      try {
        const response = await axios.get(`http://localhost:3006/api/restaurant/fetchAllRestaurants`, {
          withCredentials: true,
        });
        console.log(response);
        // dispatch(setMenuItems(response.data.items))
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  })

  const getAllUsers = ({ userID }) => useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      console.log(userID);

      try {
        const response = await axios.get(`http://localhost:3006/api/restaurant/fetchAllUsers/${userID}`, {
          withCredentials: true,
        });
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  })

  const addItem = useMutation({
    mutationFn: async (formData) => {
      try {
        console.log(formData);
        const response = await axios.post("http://localhost:3006/api/restaurant/addItem", {
          ...formData,
        }, {
          withCredentials: true,
        });
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  })
  return { Add_Adresses, getAllUsers, fetchRestaurant, fetchAllRestaurant, addItem }
};

export default useRestaurant;
