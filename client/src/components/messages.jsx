import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { initializeSocket } from "../../src/lib/socket";
import { useUser } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';

const Messages = ({ conversations }) => {
  const { userInfo } = useSelector(state => state.auth)
  console.log(userInfo, "..");

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [currentMessages, setCurrentMessages] = useState([]);
  const userId = userInfo?.userId;
  console.log(conversations);
  console.log(selectedConversation);
  const socket = initializeSocket(userInfo?.userId);
  const { isLoaded, isSignedIn, user } = useUser();
  //const [userRole, setUserRole] = useState(user?.unsafeMetadata?.role);
  useEffect(() => {
    if (selectedConversation && selectedConversation.messages) {
      //alert(true)
      setCurrentMessages(selectedConversation.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        time: new Date(msg.created_at).toLocaleTimeString(),
        isSender: msg.sender_id === userInfo.userId,
      })));
    }
  }, [selectedConversation]);
  // console.log(socket);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleNewMessage = (data) => {
      console.log("Received new message:", data);
      console.log(userInfo.userId);

      let newMessage = {
        id: data.id,
        content: data.message,
        time: new Date(data.createdAt).toLocaleTimeString(),
        isSender: data.senderId === userInfo.userId,
        senderType: data.senderType,
      };

      console.log(newMessage);

      setCurrentMessages((prevMessages) => {
        console.log("Updated messages:", [...prevMessages, newMessage]);
        return [...prevMessages, newMessage];
      });
    };
    socket.off("newMessage", handleNewMessage);
    socket.on("newMessage", handleNewMessage);

    return () => {
      // Cleanup when component unmounts to prevent memory leaks
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, userInfo.userId]);


  const handleSendMessage = () => {
    if (message.trim() !== '') {
      let formData = {
        content: message, conversationID: selectedConversation.id, senderId: userInfo.userId, senderType: userInfo.role
      }
      socket.emit("sendMessage", { formData });
      setMessage('');
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  console.log("selectedConversation", selectedConversation);

  // if (!socket) {
  //   console.error("Socket is undefined! Check your initialization.");
  //   return;
  // }
  return (
    <Card className="w-full h-[calc(100vh-100px)] flex flex-row overflow-hidden">
      <div className={`border-r ${isSidebarOpen ? 'w-64' : 'w-12'} transition-all duration-300 flex flex-col bg-gray-50`}>
        <Button
          variant="ghost"
          size="sm"
          className="m-1 flex justify-center w-10 "
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
        {isSidebarOpen ? (
          <>
            <div className="p-3 border-b bg-white">
              <h2 className="text-2xl font-semibold mb-5">Messages</h2>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." className="pl-8 text-sm" />
              </div>
            </div>
            <ScrollArea className="flex-1 h-[calc(100vh-100%)]">
              {conversations?.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 hover:bg-gray-100 cursor-pointer ${selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''}`}
                  onClick={() => {
                    setSelectedConversation(conversation)
                    socket.emit("joinRoom", `conversation_${conversation.id}`);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{conversation?.title?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm truncate">{conversation?.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(conversation?.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 truncate">
                          {conversation?.messages && conversation?.messages.length > 0
                            ? conversation.messages[conversation.messages.length - 1].content
                            : 'No messages yet'}
                        </p>
                        <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-medium text-white bg-blue-600 rounded-full">
                          {conversation.status === "new" ? "!" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-2" />
                </div>
              ))}
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-col items-center py-3">
            {conversations.map((conversation) => (
              <Avatar
                key={conversation.id}
                className={`h-8 w-8 mb-3 cursor-pointer ${selectedConversation?.id === conversation.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <AvatarFallback>{conversation?.title?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b p-2 flex items-center gap-2 bg-white">
          {selectedConversation ? (
            <>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{selectedConversation?.title?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium text-sm">{selectedConversation?.title}</h2>
                <p className="text-xs text-gray-500">Status: {selectedConversation?.status}</p>
              </div>
            </>
          ) : (
            <h2 className="font-medium text-sm">Select a conversation</h2>
          )}
        </div>

        {selectedConversation ? (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 h-[calc(100vh-100%)] p-3">
              <div className="space-y-3 mr-3">
                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg?.isSender ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-2 rounded-lg ${msg?.isSender ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                      <p className="text-sm">{msg?.content}</p>
                      <p className={`text-xs mt-1 ${msg?.isSender ? 'text-blue-100' : 'text-gray-500'}`}>{msg?.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  className="flex-1 text-sm"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <Button size="sm" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <CardContent className="text-center">
              <p className="text-gray-500 text-sm">Select a conversation to start messaging</p>
            </CardContent>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Messages;