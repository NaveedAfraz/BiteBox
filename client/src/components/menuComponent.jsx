import React, { useActionState, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Delete, DollarSign, Edit, Tag, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "./ui/input";
import { useSelector } from "react-redux";
import { useUser } from "@clerk/clerk-react";
import useRestaurant from "@/hooks/Restaurant/useRestaurant";
import { Label } from "./ui/label";
import { useNavigate } from "react-router";

const EditDialogContent = ({
  menu,
  onSubmit,
  onClose,
  formAction,
  prevData,
}) => {
  ////console.log(formAction);
  // console.log(prevData);

  return (
    <>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            Make changes to the menu item here.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-4 py-4">
          <Label htmlFor="ItemName">Item Name</Label>
          <Input
            label="ItemName"
            name="ItemName"
            placeholder="Item Name"
            defaultValue={prevData.name}
            // defaultValue={menu.brand}
            className="col-span-3"
          />

          <Label htmlFor="Description">Description</Label>
          <Input
            label="Description"
            name="ItemDescription"
            placeholder="Item Description"
            defaultValue={prevData.description}
            className="col-span-3"
          />

          <div className="grid grid-cols-1 gap-4">
            <Label htmlFor="Price">Amount</Label>
            <Input
              label="Price"
              name="price"
              placeholder="Price"
              type="number"
              defaultValue={menu.Amount}
            />
          </div>

          <div className="flex justify-end gap-2 items-center mt-8">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="cursor-pointer">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </>
  );
};

function MenuComponent({ menu, refetch }) {
  const [open, setOpen] = useState(false);
  const { user, isLoaded, updateUserMetadata } = useUser();
  const userRole = user?.unsafeMetadata?.role;
  console.log(userRole);
  console.log(menu);

  console.log(menu, "menu");
  const navigate = useNavigate();
  const { deleteItem, updateItem } = useRestaurant();
  const { restaurantDetails } = useSelector((state) => state.restaurant);
  // let admin = true;
  //// console.log(restaurantDetails);
  const [prevData, setPrevData] = useState({
    brand: menu.brand,
    name: menu.Name,
    description: menu.desc,
    price: menu.Amount,
    category: menu.category,
    photoUrl: menu.photoUrl,
    time: menu.time,
  });
  const handleDelete = async (menu) => {
    // e.stopPropagation();
    // alert("Delete");
    // console.log(menu.itemID);

    await deleteItem.mutateAsync({ itemID: menu.itemID });
    refetch();
  };
  ////console.log(menu);

  // const handleCardClick = () => {

  //     alert("clicked");
  // }

  //// console.log(menu.img);
  const handleSubmit = (prevState, formData) => {
    // console.log(menu);

    const updatedMenu = {
      id: menu.itemID,
      name: formData.get("ItemName"),
      description: formData.get("ItemDescription"),
      price: parseFloat(formData.get("price")),
      category: formData.get("category"),
      photoUrl: menu.photoUrl,
      brand: formData.get("brand"),
    };
    setPrevData(updatedMenu);
    // console.log(updatedMenu);
    updateItem.mutate({ formdata: updatedMenu });
    setOpen(false);
    // setTimeout(() => refetch(), 1000)
    // onClose();
  };

  let initialState = null;
  const [state, formAction, isPending] = useActionState(
    handleSubmit,
    initialState
  );

  // console.log(menu);
  if (
    (menu.status === "pending" && userRole !== "vendor") ||
    userRole === "admin"
  ) {
    // console.log("..");
    return null;
  }

  return (
    <Card
      onClick={() =>
       userRole != "vendor" ? navigate(`/restaurant?name=${menu.Name}&&ID=${menu.restaurantID}`) : null
      }
      className="relative w-full max-w-sm border-0 shadow-lg overflow-hidden rounded-lg cursor-pointer hover:scale-102 transition-all duration-300 mb-4"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={menu.img}
          alt={menu.name}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold mb-1">
          <p className="text-sm text-gray-500">{menu.brand}</p>
          <p>{menu.Name}</p>
        </CardTitle>

        {(menu.rating || menu.time) && (
          <p className="text-sm text-gray-500 mb-1">
            {menu.rating && <span>{menu.rating}</span>}
            {menu.rating && menu.time && <span className="mx-1">•</span>}
            {menu.time && <span>{menu.time} mins</span>}
          </p>
        )}

        {menu.desc && (
          <CardDescription className="text-sm text-gray-600 mb-2">
            {menu.desc}
          </CardDescription>
        )}

        {/* Price and Discount Section with Icons */}
        <div className="flex items-center  gap-2 mb-1">
          {menu.Amount && (
            <>
              <DollarSign className="h-4 w-4 text-gray-700" />
              <span className="text-sm font-semibold line-through text-gray-800">
                {menu.Amount}
              </span>
            </>
          )}
        </div>

        {menu.discountedAmount && (
          <div className="flex items-center gap-2 mb-1">
            <Tag className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">
              {menu.discountedAmount}
            </span>
          </div>
        )}

        {menu.foodType && (
          <p className="text-sm font-semibold text-gray-800 mb-1">
            {menu.foodType}
          </p>
        )}

        {userRole === "vendor" || userRole === "admin" ? (
          <div className="w-full relative bottom-[-20px] flex gap-2">
            <Button variant="destructive" onClick={() => handleDelete(menu)}>
              <Trash2 className="h-4 w-4" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>

              <EditDialogContent
                menu={menu}
                onSubmit={handleSubmit}
                prevData={prevData}
                formAction={formAction}
                onClose={() => setOpen(false)}
              />
            </Dialog>
          </div>
        ) : (
          <div></div>
        )}
      </CardContent>
    </Card>
  );
}

export default MenuComponent;
