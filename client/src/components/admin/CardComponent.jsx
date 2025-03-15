import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '@radix-ui/react-select';

const Render = ({ item, title, formAction }) => {
  //console.log(item);
  const { icon: IconComponent, value, description, trend } = item;

  switch (title) {
    case "dashboardCard":
      return (
        <Card className="w-46 m-2 shadow-sm text-black">
          <CardHeader className="p-2">
            <div className="flex items-center space-x-5">
              <IconComponent className="h-5 w-5 text-gray-700" />
              <span className="text-xs font-semibold">{title}</span>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-lg font-bold">{value}</div>
            <div className="text-xs text-gray-500">{description}</div>
            <div className="text-xs text-green-600">{trend}</div>
          </CardContent>
        </Card>
      );
    case "reviews":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {item.map((review) => (
            <Card key={review.id} className="">
              <CardContent className="p-6 text-black">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{review.user}</h3>
                    <p className="text-sm text-gray-400">{review.date}</p>
                  </div>
                  <div className="flex items-center bg-blue-600 px-3 py-1 rounded-full">
                    <span className="text-sm">⭐ {review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    case "AddItems":
      return (
        <form action={formAction}>
          <div className="flex flex-col space-y-3 w-[40vw]">
            <Input
              type="text"
              name="name"
              placeholder="Item Name"
              className="border p-2 rounded"
            />

            <Input
              type="number"
              name="price"
              placeholder="Price"
              className="border p-2 rounded"
            />

            <Input
              type="number"
              name="quantity"
              placeholder="Quantity"
              className="border p-2 rounded"
            />

            <div className="space-y-2">
              <label htmlFor="category">Category</label>
              <Select name="category" defaultValue="burger">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="burger">Burger</SelectItem>
                  <SelectItem value="pizza">Pizza</SelectItem>
                  <SelectItem value="drink">Drink</SelectItem>
                  <SelectItem value="sides">Sides</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="category">Item Type</label>
              <Select name="foodtype" defaultValue="burger">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="drink">Veg</SelectItem>
                  <SelectItem value="sides">non-veg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <textarea
              placeholder="Description"
              name="description"
              className="border p-2 rounded"
              rows="3"
            ></textarea>

            <div className="border p-2 rounded">
              <label className="block mb-2 text-sm">Item Photo</label>
              <input
                type="file"
                name="photo"
                placeholder="Upload Photo"
                required={true}
                accept="image/*"
                className="w-full text-sm"
              />
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded">
              Add Item
            </button>
          </div>
        </form >
      )
    default:
      return null;
  }
};

function CardComponent({ item, title, formAction }) {
  // console.log(item);
  // console.log(title);

  return (
    <div className="my-4 text-black">
      <Render item={item} title={title} formAction={formAction} />
    </div>
  );
}

export default CardComponent;