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
import useItemQuantity from "@/hooks/Restaurant/useItemQuantity"; // Update the path as needed

function ItemCard({ item, loading, Error }) {
  if (loading) return null;
  console.log(item);

  // const [searchparams] = useSearchParams() 
  // const userid = searchparams.get('ID')  
  // console.log(userInfo);
  const { itemQuantity, handleAdd, handleReduce } = useItemQuantity(item);
  console.log(itemQuantity);
  if(itemQuantity.quantity <= 0) return alert("No items available");

  if (item.status === "pending") return <div className="text-center font-bold mt-20">No Items Found</div>;
  return (
    <div className="w-full mt-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {item?.name}
            <div className="flex flex-row gap-2 items-center py-3">
              <img src={item?.img} alt={item?.name} className="h-50 w-50" />
            </div>
            {itemQuantity < 0 && <badge> Out of Stock</badge>}
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
          <Button variant="outline" onClick={() => handleReduce()}>-</Button>
          <div className="flex flex-row gap-2 items-center">
            <Badge className="bg-black text-white px-3 py-2 mx-2">{itemQuantity || +0}</Badge>
          </div>
          <Button variant="outline" onClick={() => handleAdd()}>+</Button>
        </CardFooter>
      </Card>
    </div >
  );
}

export default ItemCard;