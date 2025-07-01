import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";

const CardComponent = ({ categories, title, teamMembers, Items, onItemClick }) => {
  const [array, setArray] = useState([]);
  const navigate = useNavigate();
  console.log(categories, title, teamMembers, Items);

  useEffect(() => {
    if (teamMembers) {
      setArray(teamMembers);
    } else if (title === "Food Categories") {
      const formattedCategories = categories.map((restaurant) => ({
        Name: restaurant?.Name,
        img: restaurant?.img,
        desc: restaurant?.Cuisine,
        category: restaurant?.category,
        restaurantID: restaurant?.restaurantID,
      })); 
      setArray(formattedCategories); 
    } else if (title === "Best Sellers" || title === "Search Results") {
      setArray(categories);
    } else {
      setArray(Items);
    }
  }, [teamMembers, categories, Items, title]);

  return (
    <div
      className={`w-full  ${teamMembers ? "flex   items-center justify-center flex-col" : ""
        }`}
    >
      {title && (
        <h2 className="text-3xl font-bold text-gray-800 text-center mt-12">
          {title}
        </h2>
      )}

      <div className={`px-5 py-8 w-full z-2 overflow-x-auto scrollbar-thin-orange scrollbar-hidden ${title.startsWith("The") ? "flex justify-center items-center" : null}`}>
        <div className="flex gap-4 pb-4 mx-auto" style={{
          minWidth: `${array?.length * 320}px`,
          scrollSnapType: 'x mandatory',
          scrollPadding: '0 1.25rem'
        }}>
          {array && array.map((category, index) => (
            <Card
              key={index}
              className="w-[300px] flex-shrink-0 border-0 shadow-lg hover:-translate-y-2 transition-transform cursor-pointer"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Card content */}

              <CardContent className="p-2">
                <button
                  onClick={() =>
                    !teamMembers && (
                      onItemClick && onItemClick(),
                      navigate(`/restaurant?name=${category?.Name}&&ID=${category?.restaurantID}`))
                  }
                >
                  {/* Circle Image */}
                  <div className="w-full">
                    <img
                      src={category.img}
                      alt={category.Name}
                      className="w-[280px] h-[280px] object-cover rounded-full"
                    />
                  </div>

                  {/* Card Text */}
                  <CardHeader className="p-4 relative">
                    {title !== undefined &&
                      !title.split(" ").includes("Food") && (
                        <CardTitle className="text-lg text-center">
                          {category.Name}
                        </CardTitle>
                      )}
                    <p className="text-sm text-gray-500 mt-1.5">
                      {category.desc}
                    </p>
                    {title !== undefined &&
                      title.split(" ").includes("Food") && (
                        <p className="text-xl font-bold absolute bottom-0 right-[50%] translate-x-[50%]">
                          {category.category}
                        </p>
                      )}
                  </CardHeader>
                </button>

                {/* Team Members Info */}
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
          ))
          }
        </div >
      </div >
    </div >
  );
};

export default CardComponent;
