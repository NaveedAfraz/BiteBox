import { Mutation, useMutation } from "@tanstack/react-query";
import axios from "axios";

const useAddresses = () => {
  const Add_Adresses = useMutation({
    mutationFn: async ({ formData, restaurantData }) => {
      console.log(formData, restaurantData);
      let api;
      if (formData.role == "vendor") {
        api = "http://localhost:3006/api/restaurant/restaurantAddresses"
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
          userId: formData.userId,
          email: formData.email
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
  return { Add_Adresses }
};

export default useAddresses;
