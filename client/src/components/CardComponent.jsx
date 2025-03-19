import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";

const CardComponent = ({ categories, title, teamMembers }) => {
  console.log(categories, title);
  const [array, setArray] = useState([]);
  //console.log(title);
  console.log(teamMembers);

  const navigate = useNavigate()
  useEffect(() => {
    if (teamMembers) {
      setArray(teamMembers);

    } else if (title === "Food Categories") {

      const formattedCategories = categories.map((restaurant) => ({
        Name: restaurant?.Name,
        img: restaurant?.img, // Rename RestaurantImage to img
        desc: restaurant?.Cuisine, // Use Cuisine as description
        // brand: restaurant.status, // Assign status to brand for UI compatibility
        category: restaurant?.category,
        restaurantID: restaurant?.restaurantID,

      }));
      setArray(formattedCategories);
    } else {
      setArray(categories);
    }
  }, [teamMembers, categories]);
  console.log(array.length);
  //

  return (
    <div
      className={`w-full ${teamMembers ? "flex items-center justify-center flex-col" : null
        }`}
    >
      <h2 className="text-3xl font-bold text-gray-800 text-center  mt-12">
        {title}
      </h2>
      <div className="px-5 py-8 bg-white scrollbar-hide">
        <div className={`flex gap-16  overflow-x-auto pb-4 scrollbar-hide`}>
          {array.map((category) => (
            <Card
              key={category.id}
              className="w-[300px] border-0  shadow-lg hover:-translate-y-2 transition-transform cursor-pointer hover:!bg-transparent "
            >
              <CardContent className="p-2 ">
                <button className="" onClick={() => !teamMembers && navigate(`/restaurant?name=${category?.Name}&&ID=${category?.restaurantID}`)}>
                  <div className="w-full">
                    <img
                      src={category.img}
                      alt={category.Name}
                      className="w-[100vw]  h-[250px] object-cover rounded-[50%]"
                    />
                  </div>


                  {console.log(array.length)}
                  <CardHeader className="p-4 relative">
                    {title != undefined && !title.split(" ").includes("Food") && <CardTitle className="text-lg text-center">
                      {category.Name}
                    </CardTitle>}
                    <p className="text-sm text-gray-500 mt-1.5">
                      {category.desc}
                    </p>
                    {title != undefined && title.split(" ").includes("Food") && <p className="text-xl   font-bold absolute bottom-[-0px] right-[50%] translate-x-[50%]">
                      {category.category}
                    </p>
                    }
                  </CardHeader>
                </button>
                {teamMembers && (
                  <CardContent className="p-2">
                    <p className="text-sm text-gray-500 mb-5">
                      {category.role}
                    </p>
                    <p className="text-sm text-gray-500">
                      {/* {category.description} */}
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
