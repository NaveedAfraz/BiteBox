import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

const Render = ({ item, title }) => {
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
    default:
      return null;
  }
};

function CardComponent({ item, title }) {
  // console.log(item);
  // console.log(title);

  return (
    <div className="my-4 text-black">
      <Render item={item} title={title} />
    </div>
  );
}

export default CardComponent;