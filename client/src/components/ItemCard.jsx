import React, { useEffect, useState } from "react";
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
import useCart from "@/hooks/Restaurant/useCart";
import { useSearchParams } from "react-router";
import { useSelector } from "react-redux";
function ItemCard({ item, loading }) {
  if (loading) return null;
  console.log(item);

  const { userInfo } = useSelector(state => state.auth)
  // const [searchparams] = useSearchParams() 
  // const userid = searchparams.get('ID')  
  // console.log(userInfo);
  const { AddToCart, fetchCart, ReduceQuantity } = useCart()
  const userId = userInfo?.userId
  const { mutate } = AddToCart()
  const reduceMutation = ReduceQuantity();
  const { data: cartItems, refetch } = fetchCart(userId)
  console.log(cartItems);

  const [itemQuantity, setItemQuantity] = useState(0);

  useEffect(() => {
    if (cartItems?.items && cartItems.items.length > 0) {
      const matchingItem = cartItems.items.find(i => i.itemID === item.itemID);
      setItemQuantity(matchingItem ? matchingItem.quantity : 0);
    } else {
      setItemQuantity(0);
    }
    console.log(true);

  }, [cartItems, item.itemID]);


  const handleAdd = function (item) {
    console.log(item);
    mutate({ ...item, userId });
    setTimeout(() => refetch(), 100);
  }

  const handleReduce = () => {
    if (itemQuantity > 0 && cartItems?.cartId) {
      reduceMutation.mutate({
        userId,
        cartId: cartItems.cartId,
        itemID: item.itemID
      });
      setTimeout(() => refetch(), 100);
    }
  };

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
          <Button variant="outline" onClick={handleReduce}>-</Button>
          <div className="flex flex-row gap-2 items-center">
            <Badge className="bg-black text-white px-3 py-2 mx-2">{itemQuantity || 0}</Badge>
          </div>
          <Button variant="outline" onClick={() => handleAdd(item)}>+</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ItemCard;
