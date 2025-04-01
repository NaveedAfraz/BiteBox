import React, { useEffect } from "react";
import CardComponent from "../components/CardComponent";
import MenuComponent from "../components/menuComponent";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { Card, CardContent, CardDescription, CardTitle, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { filterButtons } from "../config/details";
import useRestaurant from "@/hooks/Restaurant/useRestaurant";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useFilteredItems from "@/hooks/Restaurant/useSort";

function Menu() {
  const { fetchAllRestaurant } = useRestaurant();
  const { data: AllRestaurant } = fetchAllRestaurant();
  const { menuItems, restaurantDetails } = useSelector((state) => state.restaurant);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItem] = React.useState(null);
  const {
    search,
    sort,
    order,
    foodType,
    handleFilter,
    data: filteredItems,
    isLoading,
    isError,
    error,
  } = useFilteredItems();

  useEffect(() => {
    const params = { search, sort, order, foodType };
    setSearchParams(params);
  }, [search, sort, order, foodType, setSearchParams]);


  useEffect(() => {
    const checkStatus = () => {
      const result = filteredItems?.data.filter((item) => item.status == "approved")
      console.log(result);

      if (result) {
        setItem(result)
      } else {
        setItem(null)
      }
      return result;
    }
    console.log(checkStatus(), "..");
  }, [filteredItems?.data])
  console.log(filteredItems);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 relative">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/menu">Menu</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="container mx-auto px-4 relative">
          {<h1 className="text-2xl font-bold absolute top-10 left-10">
            What's cooking for you today?
          </h1>}
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            <CardComponent categories={menuItems} title=" " Items={items} />
          </div>
        </div>
        <div className="container mx-auto px-4 mt-10">
          <h1 className="text-2xl font-bold ml-10">Our Top Brands </h1>
          <div className="flex gap-5 overflow-x-auto scrollbar-hide">
            {restaurantDetails.length > 0 &&
              restaurantDetails.map((restaurant) => (
                <Card
                  key={restaurant.restaurantID}
                  onClick={() => navigate(`/restaurant?name=${restaurant.Name}&&ID=${restaurant.restaurantID}`)}
                  className="w-[300px] h-[400px] flex flex-col items-center justify-center border-0 shadow-lg rounded-lg"
                >
                  <CardHeader>
                    <div className="w-full">
                      <img
                        src={restaurant.RestaurantImage}
                        alt={restaurant.Name}
                        className="w-[100vw] h-[250px] object-cover rounded-[50%]"
                      />
                    </div>
                    <CardTitle className="text-center mt-4">
                      {restaurant.Name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
          </div>
        </div>
        <div className="container mx-auto px-4 mt-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold ml-10">For You</h1>
            <p className="text-gray-500 ml-10">
              These are the top picks from our chefs
            </p>
          </div>
          <div className="flex flex-wrap items-center w-full gap-3.5 p-2">
            {filterButtons.map((button) => (
              <Button
                variant="primary"
                key={button.id}
                onClick={() =>
                  handleFilter(button.filterType, button.value, button.order)
                }
                className={`flex items-center gap-2 ${(button.filterType === "foodType" && button.value === foodType) ||
                  (button.filterType === "sort" &&
                    button.value === sort &&
                    button.order === order)
                  ? "bg-green-900"
                  : "default"
                  }`}
              >
                {button.icon} {button.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 mt-10">
          <div className="flex flex-wrap gap-4 w-full ml-10 lg:ml-0">
            {isLoading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-12"></div>
            ) : isError ? (
              <p className="mb-12 font-bold">Items Not Found</p>
            ) : (
              items &&
              items.length > 0 &&
              items.map((item) => (
                <MenuComponent key={item.id || item._id} menu={item} />
              ))
            )}
          </div>
          {/* <p className="font-bold text-lg text-center my-5.5"> {Error} </p> */}
        </div>
      </main>
    </div>
  );
}

export default Menu;
