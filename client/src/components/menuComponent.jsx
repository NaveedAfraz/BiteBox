import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Delete, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";

const EditDialogContent = ({ menu, onSubmit, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(true);
    onClose();
  };

  return (
    <>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogDescription>
            Make changes to the menu item here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <Input
            label="Brand Name"
            defaultValue={menu.brand}
            className="col-span-3"
          />

          <Input
            label="Description"
            defaultValue={menu.description}
            className="col-span-3"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              defaultValue={menu.price}
            />
            <Input
              label="Preparation Time (mins)"
              type="number"
              defaultValue={menu.time}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
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
  )
}

function MenuComponent({ menu }) {
  const [open, setOpen] = useState(false);

  let admin = true;

  const handleDelete = (e) => {
    e.stopPropagation();
    alert("Delete");
  }

  const handleCardClick = () => {
    if (open) {
      alert("clicked");
    }
  }

  const handleSubmit = (saved) => {
    // Handle the form submission result
    console.log("Form was saved:", saved);
  }

  return (
    <Card
      onClick={handleCardClick}
      className="relative w-full max-w-sm border-0 shadow-lg overflow-hidden rounded-lg cursor-pointer hover:scale-102 transition-all duration-300"
    >
      <div className="relative w-full h-40">
        <img
          src={menu.image}
          alt={menu.name}
          className="h-full w-full object-cover"
        />
        {menu.discount && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {menu.discount}
          </span>
        )}
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        <CardTitle className="text-lg font-bold mb-1">{admin ? menu.brand : menu.name}</CardTitle>

        {/* Rating & Time */}
        {(menu.rating || menu.time) && (
          <p className="text-sm text-gray-500 mb-1">
            {menu.rating && <span>{menu.rating}</span>}
            {menu.rating && menu.time && <span className="mx-1">•</span>}
            {menu.time && <span>{menu.time} mins</span>}
          </p>
        )}

        {/* Description */}
        {menu.description && (
          <CardDescription className="text-sm text-gray-600 mb-2">
            {menu.description}
          </CardDescription>
        )}

        {/* Offer & Price */}
        {menu.offer && (
          <p className="text-sm font-semibold text-green-600 mb-1">
            {menu.offer}
          </p>
        )}
        {menu.price && (
          <p className="text-sm font-semibold text-gray-800">{menu.price}</p>
        )}
        {admin && (
          <div className="w-full relative bottom-[-20px] z-20 flex gap-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>

              <EditDialogContent
                menu={menu}
                onSubmit={handleSubmit}
                onClose={() => setOpen(false)}
              />
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MenuComponent;