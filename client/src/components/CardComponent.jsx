import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CardComponent = ({ categories, title, teamMembers }) => {
  console.log(categories);
  const [array, setArray] = useState([]);
  useEffect(() => {
    if (teamMembers) {
      setArray(teamMembers);
    } else {
      setArray(categories);
    }
  }, [teamMembers, categories]);
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-800 text-center  mt-12">
        {title}
      </h2>
      <div className="px-5 py-8 bg-white scrollbar-hide">
        <div
          className={`flex gap-20 overflow-x-auto ${
            categories
              ? "justify-center items-center"
              : "justify-start items-start"
          } pb-4 scrollbar-hide`}
        >
          {array.map((category) => (
            <Card
              key={category.id}
              className="min-w-[300px] border-0 shadow-lg hover:-translate-y-2 transition-transform cursor-pointer hover:!bg-transparent"
            >
              <CardContent className="p-2">
                <button className="relative" onClick={() => alert("hello")}>
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-[250px] rounded-lg  object-cover"
                  />
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg text-center">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                </button>
                {teamMembers && (
                  <CardContent className="p-2">
                    <p className="text-sm text-gray-500 mb-5">
                      {category.role}
                    </p>
                    <p className="text-sm text-gray-500">
                      {category.description}
                    </p>
                  </CardContent>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
