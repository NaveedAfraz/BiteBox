import { userDetails } from "@/store/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";

const useAuth = () => {
  const dispatch = useDispatch()
  const loginAuth = useMutation({
    mutationFn: async ({ formData }) => {
      console.log(formData, "formData in loginAuth");

      try {
        console.log(formData);
        const response = await axios.post(`${import.meta.env.VITE_API_URL
          }/api/auth/login`, {
          email: formData.email,
          password: formData.password,
          role: formData.role,
          username: formData.username
        }, {
          withCredentials: true
        })
        console.log(response, "response from server in loginAuth");
        console.log("Response from server:", response.data);
        return response.data;
      } catch (err) {
        console.log(err);
        throw new Error("Invalid credentials");
      }
    }
  })

  const signupAuth = useMutation({
    mutationFn: async ({ formData }) => {
      try {
        console.log(formData);
        const response = await axios.post(`${import.meta.env.VITE_API_URL
          }/api/auth/signup`, {
          email: formData.email,
          role: formData.role,
          username: formData.username
        }, {
          withCredentials: true
        })
        console.log(response);
        return response.data;
      } catch (err) {
        console.log(err);
        throw new Error("Signup failed");
      }
    }
  })

  const useLoggedIn = (email) => useQuery({
    queryKey: ["loggedIn", email],
    queryFn: async () => {
      console.log(email, "email in useLoggedIn");

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL
          }/api/auth/loggedIn/${email}`, {
          withCredentials: true
        });
        console.log(response, "response from server in useLoggedIn");

        console.log("Response from server:", response.data);
        dispatch(userDetails(response.data))
        return response.data;
      } catch (err) {
        console.log(err, "eerrror in useLoggedIn");
        throw new Error("Failed to fetch loggedIn status");
      }
    },
    enabled: !!email,
  });
  return { loginAuth, useLoggedIn, signupAuth };
}

export default useAuth;