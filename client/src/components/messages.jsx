import React, { useState } from 'react';
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

const Messages = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');

  // Sample contacts data
  const contacts = [
    { id: 1, name: "Sarah Johnson", avatar: "/api/placeholder/40/40", lastMessage: "Your order is on the way!", unread: 2, lastActive: "5m ago" },
    { id: 2, name: "BiteBOX Support", avatar: "/api/placeholder/40/40", lastMessage: "How can we help you today?", unread: 0, lastActive: "2h ago" },
    { id: 3, name: "Aisha's Kitchen", avatar: "/api/placeholder/40/40", lastMessage: "Thank you for your order!", unread: 0, lastActive: "1d ago" },
    { id: 4, name: "Carlos Rodriguez", avatar: "/api/placeholder/40/40", lastMessage: "I'll be there in 10 minutes", unread: 1, lastActive: "20m ago" },
    { id: 5, name: "Emma Wilson", avatar: "/api/placeholder/40/40", lastMessage: "Can you add extra sauce?", unread: 0, lastActive: "3d ago" },
    {
      id: 7,
      name: "John Doe",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Hello, how are you?",
      unread: 0,
      lastActive: "4d ago"
    }, {
      id: 8,
      name: "John Doe",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Hello, how are you?",
      unread: 0,
      lastActive: "4d ago"
    }, {
      id: 9,
      name: "John Doe",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Hello, how are you?",
      unread: 0,
      lastActive: "4d ago"
    }
  ];

  // Sample messages for the selected contact
  const messages = [
    { id: 1, sender: "Carlos Rodriguez", content: "I'm on my way with your order!", time: "10:24 AM", isSender: false },
    { id: 2, sender: "You", content: "Great! Can you call me when you're outside?", time: "10:26 AM", isSender: true },
    { id: 3, sender: "Carlos Rodriguez", content: "Sure thing! I'll be there in about 10 minutes.", time: "10:27 AM", isSender: false },
    { id: 4, sender: "You", content: "Perfect, thank you!", time: "10:28 AM", isSender: true },
    { id: 5, sender: "Carlos Rodriguez", content: "I'm on my way with your order!", time: "10:24 AM", isSender: false },
    { id: 6, sender: "You", content: "Great! Can you call me when you're outside?", time: "10:26 AM", isSender: true },
    { id: 7, sender: "Carlos Rodriguez", content: "Sure thing! I'll be there in about 10 minutes.", time: "10:27 AM", isSender: false },
    { id: 8, sender: "You", content: "Perfect, thank you!", time: "10:28 AM", isSender: true },
    { id: 9, sender: "Carlos Rodriguez", content: "I'm on my way with your order!", time: "10:24 AM", isSender: false },
    { id: 10, sender: "You", content: "Great! Can you call me when you're outside?", time: "10:26 AM", isSender: true },
    { id: 11, sender: "Carlos Rodriguez", content: "Sure thing! I'll be there in about 10 minutes.", time: "10:27 AM", isSender: false },
    { id: 12, sender: "You", content: "Perfect, thank you!", time: "10:28 AM", isSender: true },
    { id: 13, sender: "Carlos Rodriguez", content: "I'm on my way with your order!", time: "10:24 AM", isSender: false },
    { id: 14, sender: "You", content: "Great! Can you call me when you're outside?", time: "10:26 AM", isSender: true },
    { id: 15, sender: "Carlos Rodriguez", content: "Sure thing! I'll be there in about 10 minutes.", time: "10:27 AM", isSender: false },
    { id: 15, sender: "You", content: "Perfect, thank you!", time: "10:28 AM", isSender: true },
    { id: 16, sender: "Carlos Rodriguez", content: "I'm on my way with your order!", time: "10:24 AM", isSender: false },
    { id: 17, sender: "You", content: "Great! Can you call me when you're outside?", time: "10:26 AM", isSender: true },
    { id: 18, sender: "Carlos Rodriguez", content: "Sure thing! I'll be there in about 10 minutes.", time: "10:27 AM", isSender: false },
    { id: 19, sender: "You", content: "Perfect, thank you!", time: "10:28 AM", isSender: true },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      console.log("Sending message:", message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-[calc(100vh-100px)] flex flex-row overflow-hidden">
      {/* Sidebar - part of the main card */}
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
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-3 hover:bg-gray-100 cursor-pointer ${selectedContact?.id === contact.id ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-sm truncate">{contact.name}</p>
                        <span className="text-xs text-gray-500">{contact.lastActive}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
                        {contact.unread > 0 && (
                          <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-medium text-white bg-blue-600 rounded-full">
                            {contact.unread}
                          </span>
                        )}
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
            {contacts.map((contact) => (
              <Avatar
                key={contact.id}
                className={`h-8 w-8 mb-3 cursor-pointer ${selectedContact?.id === contact.id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedContact(contact)}
              >
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        )}


      </div>

      {/* Chat Area - part of the main card */}
      <div className="flex-1 flex flex-col">
        <div className="border-b p-2 flex items-center gap-2 bg-white">
          {selectedContact ? (
            <>
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedContact.avatar} />
                <AvatarFallback>{selectedContact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-medium text-sm">{selectedContact.name}</h2>
                <p className="text-xs text-gray-500">Active {selectedContact.lastActive}</p>
              </div>
            </>
          ) : (
            <h2 className="font-medium text-sm">Select a conversation</h2>
          )}
        </div>

        {selectedContact ? (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 h-[calc(100vh-100%)]">
              <div className="space-y-3 mr-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs p-2 rounded-lg ${msg.isSender ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.isSender ? 'text-blue-100' : 'text-gray-500'}`}>{msg.time}</p>
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