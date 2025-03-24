import React, { useActionState, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { contactDetails } from "@/config/details";
import useContact from "@/hooks/contact/useMessages";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSelector } from "react-redux";
import useOrders from "@/hooks/Restaurant/useOrder";
import socket from "@/lib/socket";

const Contact = () => {
  const [selectedOrderID, setSelectedOrderID] = useState();
  const { userInfo } = useSelector(state => state.auth);
  const { sendMessage, messages, isLoading } = useContact(userInfo?.userId);
  console.log(messages, "messages");

  const { fetchOrders } = useOrders()

  const { refetch: refetchOrders } = fetchOrders(userInfo?.userId);
  const { orderIDs } = useSelector(state => state.restaurant);
  // console.log(orderIDs, "orderIDs");

  const stringOrderIDs = orderIDs.map(String);

  // let orderIDs = [1, 2, 3, 4, 5]
  const handleSubmit = async (prevValue, formData) => {
    const title = formData.get('title');
    const message = formData.get('message');
    console.log(title, message);

    if (!title) {
      toast("Please enter a title");
      return;
    }
    if (!message) {
      toast("Please enter a message");
      return;
    }

    let formdata = {
      title: title,
      message: message,
      senderId: userInfo?.userId,
      senderType: "customer",
      orderId: selectedOrderID,
      userType: "restaurant",
      status: "active"
    }
    sendMessage.mutate(formdata);
  }

  const intialState = null;
  const [state, formAction, isPending] = useActionState(handleSubmit, intialState)
  console.log(selectedOrderID);
  useEffect(() => {
    socket.emit('order-selected', selectedOrderID);
    if (selectedOrderID) {
      console.log(true);

    }
  }, [selectedOrderID])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24">
        {/* Contact Info & Form Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600">
                We’d love to hear from you. Reach out with any questions or
                feedback.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column: Map over contact details */}
              <div className="space-y-8">
                {contactDetails.map((item) => (
                  <Card key={item.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {item.title}
                      </h2>
                      <ul className="space-y-2 text-gray-600">
                        {item.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Right Column: Contact Form */}
              <div className="my-auto h-[100%]">
                <Card className="border-0 shadow-lg h-full">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                      Send Us a Message
                    </h2>
                    <form className="space-y-12" action={formAction} >
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Title
                        </label>
                        <Input
                          type="text"
                          name="title"
                          placeholder="Title"
                          className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex w-full justify-around">
                        <Select>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="superAdmin">Super Admin</SelectItem>
                            <SelectItem value="Vendor">Vendor</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={selectedOrderID} onValueChange={setSelectedOrderID}>
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="OrderID" />
                          </SelectTrigger>
                          <SelectContent>
                            {stringOrderIDs.map((orderID, index) => (
                              <SelectItem key={index} value={orderID}>
                                {orderID}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label
                          htmlFor="message"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Message
                        </Label>
                        <textarea
                          name="message"
                          rows="8"
                          placeholder="Your Message"
                          className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-blue-500"
                        ></textarea>
                      </div>
                      <Button
                        className="w-full bg-blue-500 text-white rounded-md py-3 hover:bg-blue-600"
                      >
                        Submit
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full h-64">
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <p className="text-gray-700 text-xl">Map Placeholder</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
