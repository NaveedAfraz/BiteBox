import { useMutation, useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const loginAuth = useMutation({
    mutationFn: async (data) => {
      try {
        console.log(data);
        
        const response = await axios.post("/api/auth/login", {
          email: data.email,
          password: data.password,
          role: data.role,
        }, {
          withCredentials: true
        })
        return response.data;
      } catch {
        throw new Error("Invalid credentials");
      }
    }
  })

  const loggedIn = useQuery({
    queryKey: "loggedIn",
    queryFn: async (data) => {
      try {
        const response = await axios.get("/api/auth/loggedIn", {
          withCredentials: true
        })
        return response.data;
      } catch {
        throw new Error("Failed to fetch loggedIn status");
      }
    }
  })
  return { loginAuth, loggedIn }
}

export default useAuth;