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

  const loggedIn = useQuery({
    queryKey: ["loggedIn"],
    queryFn: async ({ data }) => {
      try {
        const response = await axios.get(`http://localhost:3006/api/auth/loggedIn/${data.email}`, {}, {
          withCredentials: true
        })
        return response.data;
      } catch (err) {
        console.log(err);

        throw new Error("Failed to fetch loggedIn status");
      }
    }
  })
  return { loginAuth, loggedIn, signupAuth }
}

export default useAuth;