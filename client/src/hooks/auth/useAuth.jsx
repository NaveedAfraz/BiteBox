import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAuth = () => {
  const loginAuth = useMutation({
    mutationFn: async ({ formData }) => {
      try {
        console.log(formData);

        const response = await axios.post("http://localhost:3006/api/auth/login", {
          email: formData.email,
          password: formData.password,
          role: formData.role,
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
      if (email) {
        try {
          const response = await axios.get(`http://localhost:3006/api/auth/loggedIn/${email}`, {
            withCredentials: true
          });
          console.log("Response from server:", response.data);
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