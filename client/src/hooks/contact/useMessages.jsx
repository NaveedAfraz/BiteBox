
import { initializeSocket } from "@/lib/socket";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const useContact = (userId) => {
  const [messages, setMessages] = useState([]);
  console.log(userId);

  const socket = initializeSocket(userId);
  // Use socket to send messages
  const sendMessage = useMutation({
    mutationFn: async (formData) => {
      console.log(formData);

      // Emit the message through socket.io
      //socket.emit("sendMessage", { formData });

      // Return the formData as optimistic update
      return formData;
    },
    onSuccess: (data) => {
      // Optionally handle success (though socket will handle via listeners)
      console.log("Message sent:", data);
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
    }
  });

  // Fetch conversation history
  const { data: messageHistory, isLoading, refetch } = useQuery({
    queryKey: ["contactMessage"],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/contact/fetchMessages/${userId}`
        );
        console.log(res);

        return res.data;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch messages");
      }
    },
    refetchInterval: 60000, // Refetch every minute
  });


  // Socket event listeners
  useEffect(() => {
    if (!socket) {
      console.log(socket);

      console.error("Socket is undefined! Check your initialization.");
      return;
    }
    // socket.on("newMessage", (newMessage) => {
    //   console.log("Received new message:", newMessage);
    // });

    socket.on("success", (success) => {
      console.log("Message got successfully:", success);
    });

    socket.on("messageSent", (result) => {
      console.log("Message successfully sent:", result);
    });


    socket.on("newConversation", (conversation) => {
      console.log("New conversation started:", conversation);
    });

    socket.on("messageError", (error) => {
      console.error("Message error:", error);
    });

    return () => {
      socket.off("newMessage");
      socket.off("messageSent");
      socket.off("newConversation");
      socket.off("messageError");
    };
  }, []);
  console.log(messageHistory);

  console.log(messages);

  return {
    sendMessage,
    messages: messageHistory,
    isLoading,
    refetchMessages: refetch
  };
};

export default useContact;