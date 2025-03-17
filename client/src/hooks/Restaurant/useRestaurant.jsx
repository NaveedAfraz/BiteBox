import { setMenuItems, setRestaurantDetails } from "@/store/restaurant";
import { Mutation, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
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
        dispatch(setRestaurantDetails(response.data.restaurant))
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!userID
  })

  const getPendingRejectedItems = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      try {
        const response = await axios.get(`http://localhost:3006/api/restaurant/fetchPendingRejectedItems`, {
          withCredentials: true,
        });
        //console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  })


  const fetchAllRestaurant = () => useQuery({
    queryKey: ["restaurant"],
    queryFn: async () => {
      try {
        const response = await axios.get(`http://localhost:3006/api/restaurant/fetchAllRestaurants`, {
          withCredentials: true,
        });
        console.log(response.data);
        if (response.data?.data) {
          const restaurantList = response.data.data;
          const items = restaurantList.flatMap((restaurant) => restaurant.menuItems || []);

          // Dispatching Redux actions directly inside the API call
          dispatch(setRestaurantDetails(restaurantList));
          dispatch(setMenuItems(items));
        }
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

  const updateUserStatus = useMutation({
    mutationFn: async (formData) => {
      try {
        // console.log(formData);
        const response = await axios.put(`http://localhost:3006/api/restaurant/updateUserStatus/${formData.userID}`, {
          status: formData.status,
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
  const deleteRestaurant = useMutation({
    mutationFn: async (formData) => {
      console.log(formData.restaurantID);
      try {
        const response = await axios.delete(`http://localhost:3006/api/restaurant/deleteRestaurant/${formData.restaurantID}`,
          { withCredentials: true },
        );
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  })

  const deleteItem = useMutation({
    mutationFn: async (formData) => {
      try {
        const response = await axios.delete(`http://localhost:3006/api/restaurant/deleteItem/${formData.itemID}`, {
          withCredentials: true,
        });
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  });

  const updateItem = useMutation({
    mutationFn: async ({ formdata }) => {
      try {
        console.log(formdata);

        const response = await axios.put(`http://localhost:3006/api/restaurant/updateItem/${formdata.id}`, {
          ...formdata,
        }, {
          withCredentials: true,
        });
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  });

  const approveORrejectRestaurant = useMutation({
    mutationFn: async (formData) => {
      try {

        // console.log(formData.get("status"), formData.get("restaurantId"));
        const response = await axios.put(`http://localhost:3006/api/restaurant/approveORreject`, {
          restaurantID: formData.get("restaurantId"),
          status: formData.get("status"),
          title: formData.get("title"),
          itemID: formData.get("itemId")
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

  const fetchOneRestaurant = (restaurantID) => {
    return useQuery({
      queryKey: ["fetchOneRestaurant", restaurantID],
      queryFn: async () => {
        try {
          const response = await axios.get(
            `http://localhost:3006/api/restaurant/fetchOneRestaurant/${restaurantID}`,
            { withCredentials: true }
          );
          return response.data;
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
      enabled: !!restaurantID,
    });
  };

  return { Add_Adresses, getAllUsers, fetchOneRestaurant, fetchAllRestaurant, addItem, updateUserStatus, deleteRestaurant, updateItem, deleteItem, approveORrejectRestaurant, getPendingRejectedItems }
};

export default useRestaurant;
