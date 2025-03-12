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

  const loggedIn = useQuery({
    queryKey: ["loggedIn"],
    queryFn: async (data) => {
      try {
        const response = await axios.get("/api/auth/loggedIn", {
          withCredentials: true
        })
        return response.data;
      } catch (err) {
        console.log(err);

        throw new Error("Failed to fetch loggedIn status");
      }
    }
  })
  return { loginAuth, loggedIn }
}

export default useAuth;