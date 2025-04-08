import { useState, useEffect } from "react";
import useCart from "@/hooks/Restaurant/useCart";
import { useSelector } from "react-redux";
import { toast } from "sonner";

function useItemQuantity(item = null) {
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?.userId;
  const { AddToCart, fetchCart, ReduceQuantity } = useCart();
  const { mutate: addMutate } = AddToCart();
  const { mutate: reduceMutate } = ReduceQuantity();
  const { data: cartItems, refetch } = fetchCart(userId);

  const [itemQuantity, setItemQuantity] = useState(0);

  // If an item is provided, track its quantity
  useEffect(() => {
    if (item && cartItems?.items && cartItems.items.length > 0) {
      const matchingItem = cartItems.items.find(
        (i) => i.itemID === item.itemID
      );
      setItemQuantity(matchingItem ? matchingItem.quantity : 0);
    } else {
      setItemQuantity(0);
    }
  }, [cartItems, item]);
  const [adding, setAdding] = useState(false);
  const handleAdd = (itemToAdd) => {
    // Use either the passed item or the item from the hook initialization
    const targetItem = itemToAdd || item;
    // if (itemQuantity <= 0) return alert("No suffient item quantity to add");
    setAdding(true);
    if (targetItem) {
      console.log(targetItem);
      let item;
      if (targetItem.title) {
        item = {
          ...targetItem,
          Name: targetItem.title,
          Amount: targetItem.amount,
        };
      }
      if (targetItem.quantity >= itemQuantity) {
        addMutate({ ...(item || targetItem), userId });
      } else {
        toast("You have insufficient quantity");
        return;
      }

      setTimeout(() => {
        refetch();
        setAdding(false);
        alert("Item added to cart");
        toast("Item quantity updated");
      }, 500);
    }
  };

  const handleReduce = (itemID) => {
    const targetItemID = itemID || (item ? item.itemID : null);
    setAdding(true);
    if (targetItemID && cartItems?.cartId) {
      reduceMutate({
        userId,
        cartId: cartItems.cartId,
        itemID: targetItemID,
      });
      setTimeout(() => {
        refetch();
        setAdding(false);
        toast("Item quantity updated");
      }, 500);
    }
  };

  return {
    itemQuantity,
    handleAdd,
    handleReduce,
    cartItems,
    adding,
  };
}

export default useItemQuantity;
