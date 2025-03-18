import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import { DollarSignIcon } from "lucide-react";
function ItemCard({ item, loading }) {
  if (loading) return null;
  return (
    <div className="w-full mt-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {item?.name}
            <div className="flex flex-row gap-2 items-center py-3">
              <img src={item?.img} alt={item?.name} className="h-50 w-50" />
            </div>
          </CardTitle>

          <CardDescription>{item?.desc}</CardDescription>
          <CardContent>
            <div className="flex flex-row gap-2 items-center">
              <DollarSignIcon className="w-3 h-3" />
              <Badge className="bg-amber-500 text-white">{item?.Amount}</Badge>
            </div>
          </CardContent>
        </CardHeader>
        <CardFooter>
          <Button variant="outline">-</Button>
          <div className="flex flex-row gap-2 items-center">
            <Badge className="bg-black text-white px-3 py-2 mx-2">0</Badge>
          </div>
          <Button variant="outline">+</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ItemCard;
