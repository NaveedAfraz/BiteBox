import socket from "@/lib/socket";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const useContact = (userId) => {
  const [messages, setMessages] = useState([]);
  console.log(userId);

  // Use socket to send messages
  const sendMessage = useMutation({
    mutationFn: async (formData) => {
      console.log(formData);

      // Emit the message through socket.io
      socket.emit("sendMessage", { formData });

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
          `http://localhost:3006/api/contact/fetchMessages/${userId}`
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

    socket.on("newMessage", (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
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

  const allMessages = [...(messageHistory || []), ...messages];

  return {
    sendMessage,
    messages: allMessages,
    isLoading,
    refetchMessages: refetch
  };
};

export default useContact;