import { userDetails } from "@/store/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";

const useAuth = () => {
  const dispatch = useDispatch()
  const loginAuth = useMutation({
    mutationFn: async ({ formData }) => {
      try {
        console.log(formData);
        const response = await axios.post("http://localhost:3006/api/auth/login", {
          email: formData.email,
          password: formData.password,
          role: formData.role,
          username: formData.username
        }, {
          withCredentials: true
        })
        console.log(response);
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
        const response = await axios.post("http://localhost:3006/api/auth/signup", {
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
      console.log(email);
      if (email) {
        try {
          const response = await axios.get(`http://localhost:3006/api/auth/loggedIn/${email}`, {
            withCredentials: true
          });
          console.log("Response from server:", response.data);
          dispatch(userDetails(response.data))
          return response.data;
        } catch (err) {
          console.log(err);
          throw new Error("Failed to fetch loggedIn status");
        }
      }
      return null;
    },
    enabled: !!email,
  });
  return { loginAuth, useLoggedIn, signupAuth };
}

export default useAuth;