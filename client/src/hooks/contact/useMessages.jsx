import socket from "@/lib/socket";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const useContact = () => {
  const [messages, setMessages] = useState([]);

  // Use socket to send messages
  const sendMessage = useMutation({
    mutationFn: async (formData) => {
      // Emit the message through socket.io
      socket.emit("sendMessage", formData);

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
          "http://localhost:3006/api/contact/fetchMessages"
        );
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
    // Listen for new messages
    socket.on("newMessage", (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    // Listen for message sent confirmations
    socket.on("messageSent", (result) => {
      console.log("Message successfully sent:", result);
    });

    // Listen for new conversations
    socket.on("newConversation", (conversation) => {
      console.log("New conversation started:", conversation);
    });

    // Listen for errors
    socket.on("messageError", (error) => {
      console.error("Message error:", error);
    });

    // Cleanup function to remove listeners
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