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
import { DollarSignIcon, Star } from "lucide-react";
import useItemQuantity from "@/hooks/Restaurant/useItemQuantity";

function ItemCard({ item, loading, Error }) {
  if (loading) return <Card className="w-full h-64 animate-pulse bg-gray-100" />;

  console.log(item);

  const { itemQuantity, handleAdd, handleReduce } = useItemQuantity(item);
  console.log(itemQuantity);

  if (itemQuantity.quantity <= 0) return alert("No items available");

  if (item.status === "pending") return (
    <div className="text-center font-bold mt-20">No Items Found</div>
  );

  return (
    <div className="w-[80%] mt-4 ml-3">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative">
          <img
            src={item?.img || "/api/placeholder/300/200"}
            alt={item?.Name}
            className="w-full h-48 object-cover"
          />
          {item.foodType && (
            <Badge className="absolute top-2 right-2 bg-green-500 text-white">
              {item.foodType}
            </Badge>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{item?.Name}</CardTitle>
            <Badge className="bg-amber-500 text-white flex items-center gap-1">
              <DollarSignIcon className="w-3 h-3" />
              {item?.Amount}
            </Badge>
          </div>

          <CardDescription className="mt-2 text-gray-600 line-clamp-2">
            {item?.desc || "No description available"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              {item.averageRating ? (
                <>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{item.averageRating}</span>
                  <span className="text-gray-500 text-sm">
                    ({item.reviewCount || 0} {item.reviewCount === 1 ? "review" : "reviews"})
                  </span>
                </>
              ) : (
                <span className="text-gray-500 text-sm">No reviews yet</span>
              )}
            </div>

            {item.category && (
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2 flex  items-center bg-gray-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReduce()}
            className="rounded-full w-8 h-8 p-0"
          >
            -
          </Button>

          <Badge className="bg-black text-white px-4 py-1 mx-2">
            {itemQuantity || 0}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAdd()}
            className="rounded-full w-8 h-8 p-0"
          >
            +
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ItemCard;