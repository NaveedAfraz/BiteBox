import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useContact = () => {
  const sendMessage = useMutation({
    mutationFn: async ({ formData }) => {
      console.log(formData);

      try {
        const res = await axios.post(
          "http://localhost:3006/api/contact/sendMessage",
          formData
        );
        console.log(res);
        return res.data;
      } catch (error) {
        console.error(error);
        return "Failed to send message";
      }
    },
  });

  const fetchMessage = ({ formData }) =>
    useQuery({
      queryKey: ["contactMessage"],
      queryFn: async () => {
        console.log(formData); // id ,
        try {
          const res = await axios.get(
            "http://localhost:3006/api/contact/fetchMessages"
          );
          console.log(res);
          return res.data;
        } catch (error) {
          console.error(error);
          return "Failed to fetch message";
        }
      },
      refetchInterval: 60000,
    });

  return { sendMessage, fetchMessage };
};

export default useContact;
