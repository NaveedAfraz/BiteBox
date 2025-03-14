import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
function Address({ setSelectedAddress, selectedAddress }) {
  const [addAddress, setaddAddress] = useState("");
  const addresses = [
    {
      id: 0,
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
    },
    {
      id: 1,
      street: "456 Elm St",
      city: "Othertown",
      state: "NY",
      zip: "67890",
    },
    {
      id: 2,
      street: "789 Oak St",
      city: "Thistown",
      state: "TX",
      zip: "34567",
    },
    {
      id: 3,
      street: "987 Pine St",
      city: "Big City",
      state: "IL",
      zip: "56789",
    },
    {
      id: 4,
      street: "654 Grand Ave",
      city: "Sun City",
      state: "AZ",
      zip: "23456",
    },
    {
      id: 5,
      street: "321 Maple St",
      city: "San Francisco",
      state: "CA",
      zip: "98765",
    },
    {
      id: 6,
      street: "543 Birch St",
      city: "Riverside",
      state: "CA",
      zip: "12345",
    }, {
      id: 7,
      street: "210 Willow St",
      city: "Los Angeles",
      state: "CA",
      zip: "65432",
    },
    {
      id: 8,
      street: "100 Elm St",
      city: "New York",
      state: "NY",
      zip: "00001",
    }
  ];
  console.log(selectedAddress);
  const fields = [
    { name: "street", label: "Street", placeholder: "Enter street address" },
    { name: "city", label: "City", placeholder: "Enter city" },
    { name: "state", label: "State", placeholder: "Enter state" },
    { name: "zip", label: "ZIP Code", placeholder: "Enter ZIP code" },
  ];

  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  return (
    <div className="w-full max-w-xl z-10 p-2 rounded-t-2xl bg-white md:rounded-l-2xl md:rounded-t-none">
      <CardHeader className="my-2">
        <CardTitle className="text-xl mt-3  font-bold">Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 w-full overflow-y-auto max-h-[250px] md:max-h-[107.2vh]">
          {addresses.map((item, index) => (
            <Card
              key={index}
              className={`p-4 w-full border rounded-md ${selectedAddress === item.id
                ? "border border-orange-500 bg-orange-100"
                : ""
                }`}
              onClick={() => setSelectedAddress(item.id)}
            >
              <div className="space-y-1">
                <p className="font-medium">{item.street}</p>
                <p>{item.city}</p>
                <p>
                  {item.state}, {item.zip}
                </p>
              </div>
            </Card>
          ))}
        </div>
        <Dialog>
          <DialogTrigger className="w-full" asChild>
            <Button
              className="mt-6 w-full bg-red-500 hover:bg-red-600 cursor-pointer p-6 font-bold"
              onClick={() => setaddAddress(true)}
            >
              Add New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <Input
                    name={field.name}
                    value={newAddress[field.name]}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <Button className="bg-red-500 cursor-pointer">Save Address</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </div>
  );
}

export default Address;
