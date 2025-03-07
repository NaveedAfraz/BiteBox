import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
function MenuComponent({ menu }) {
  return (
    <Card
      onClick={() => alert("clicked")}
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
        <CardTitle className="text-lg font-bold mb-1">{menu.brand}</CardTitle>

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
      </CardContent>
    </Card>
  );
}

export default MenuComponent;
