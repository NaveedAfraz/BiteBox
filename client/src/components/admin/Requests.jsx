import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Store, Pizza } from "lucide-react";

function Requests() {

  const pendingItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      description: "Classic pizza with tomato, mozzarella, and basil",
      price: "$12.99",
      shop: "Pizza Paradise",
      submittedDate: "2025-03-08",
      image: "/api/placeholder/400/300"
    },
    {
      id: 2,
      name: "Chocolate Cake",
      description: "Rich chocolate cake with ganache frosting",
      price: "$8.99",
      shop: "Sweet Delights",
      submittedDate: "2025-03-09",
      image: "/api/placeholder/400/300"
    }
  ];

  // Mock data for shops awaiting approval
  const pendingShops = [
    {
      id: 101,
      name: "Taco Fiesta",
      description: "Authentic Mexican street food",
      owner: "Maria Rodriguez",
      email: "maria@tacofiesta.com",
      submittedDate: "2025-03-07",
      logo: "/api/placeholder/100/100"
    },
    {
      id: 102,
      name: "Sushi World",
      description: "Premium Japanese cuisine",
      owner: "Kenji Tanaka",
      email: "kenji@sushiworld.com",
      submittedDate: "2025-03-08",
      logo: "/api/placeholder/100/100"
    }
  ];

  const handleApproveItem = (id) => {
    console.log(`Approved item ${id}`);
  };

  const handleRejectItem = (id) => {
    console.log(`Rejected item ${id}`);
  };

  const handleApproveShop = (id) => {
    console.log(`Approved shop ${id}`);
  };

  const handleRejectShop = (id) => {
    console.log(`Rejected shop ${id}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Pending Requests</h1>

      <Tabs defaultValue="items" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Pizza className="h-4 w-4" />
            Items Approval
            <Badge variant="secondary" className="ml-2">{pendingItems.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="shops" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            New Shop Approval
            <Badge variant="secondary" className="ml-2">{pendingShops.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  <CardDescription>From: {item.shop}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{item.price}</span>
                    <span className="text-xs text-gray-400">Submitted: {item.submittedDate}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRejectItem(item.id)}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleApproveItem(item.id)}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shops" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingShops.map((shop) => (
              <Card key={shop.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle>{shop.name}</CardTitle>
                    <CardDescription>{shop.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Owner:</span>
                      <span className="text-sm">{shop.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm">{shop.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Submitted:</span>
                      <span className="text-sm">{shop.submittedDate}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRejectShop(shop.id)}
                    className="flex items-center gap-1"
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleApproveShop(shop.id)}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Requests;