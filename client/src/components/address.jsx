import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

function Address() {
  const addresses = [
    {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
    },
    {
      street: "456 Elm St",
      city: "Othertown",
      state: "NY",
      zip: "67890",
    },
    {
      street: "789 Oak St",
      city: "Thistown",
      state: "TX",
      zip: "34567",
    },
  ];

  return (
    <Card className="w-full max-w-xl z-10 mx-auto bg-transparent border-orange-400">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 grid grid-cols-2 gap-1 cursor-pointer">
          {addresses.map((item, index) => (
            <Card key={index} className="p-4 w-full border rounded-md">
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
        <Button className="mt-6 w-full  bg-red-500 hover:bg-red-600 cursor-pointer p-6 font-bold">
          Add New
        </Button>
      </CardContent>
    </Card>
  );
}

export default Address;
