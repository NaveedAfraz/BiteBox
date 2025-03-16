import React, { useEffect, useState } from "react";
import CardComponent from "../components/CardComponent";
import { categories } from "../config/details";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { filterButtons } from "../config/details";
import { ChevronDown } from "lucide-react";
import MenuComponent from "../components/menuComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useRestaurant from "@/hooks/Restaurant/useRestaurant";
import { useDispatch, useSelector } from "react-redux";
import { setMenuItems, setRestaurantDetails } from "@/store/restaurant";
import { useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
function Menu() {
  const { fetchAllRestaurant, deleteRestaurant } = useRestaurant()
  const { userInfo } = useSelector((state) => state.auth);
  const { data: AllRestaurant } = fetchAllRestaurant()
  // console.log(AllRestaurant);
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   const items = AllRestaurant?.data.flatMap((Items) => Items.menuItems);
  //   console.log(items, "setRestaurantDetails");
  //   dispatch(setRestaurantDetails(AllRestaurant?.data))
  //   dispatch(setMenuItems(items))
  // }, [AllRestaurant])
  const { menuItems, restaurantDetails } = useSelector((state) => state.restaurant)
  console.log(menuItems, restaurantDetails, "menuItems");
  const location = useLocation()
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [foodType, setFoodType] = useState("");

  // If you also want to update the URL query parameters (optional)
  const [searchParams, setSearchParams] = useSearchParams();

  // API function: Send a POST request with the filter values
  const fetchFilteredItems = async () => {
    const response = await axios.post(
      "http://localhost:3006/api/restaurant/sort",
      { search, sort, order, foodType },
      { withCredentials: true }
    );
    return response.data;
  };

  // TanStack Query: Initially disabled; will run only on refetch
  const { data, refetch, isLoading, isError, error } = useQuery({
    queryKey: ["filteredItems", { search, sort, order, foodType }],
    queryFn: fetchFilteredItems,
    enabled: false,
  });

  // Update query params (optional)
  const updateURL = () => {
    const params = {
      search,
      sort,
      order,
      foodType,
    };
    setSearchParams(params);
  };

  // When a filter button is clicked, update the corresponding state.
  // For example, each button in filterButtons might have a "filterType" (one of: search, sort, order, foodType)
  // and a "value" to set.
  const handlefilter = (filterType, value) => {

    console.log("handlefilter");
    console.log(filterType, value);

    console.log(order, foodType, sort);

    switch (filterType) {
      case "search":
        setSearch(value);
        break;
      case "sort":
        setSort(value);
        break;
      case "order":
        setOrder(value);
        break;
      // case "foodType":
      //   setFoodType(value);
      //  break;
      default:
        break;
    }
    updateURL();
    refetch();
  };

  // useEffect(() => {
  //   console.log("runEffect");

  //   refetch();
  // }, [search, sort, order, foodType, refetch]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div>Error: {error.message}</div>;
  // }
  return (
    <div className="min-h-screen flex flex-col ">
      <main className="flex-grow pt-24 ">
        <div className="container mx-auto px-4 relative">
          <Breadcrumb className="">
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
          <h1 className="text-2xl font-bold absolute  top-10 left-10">
            What's cooking for you today ?
          </h1>
          <div className="flex gap-8 overflow-x-auto  scrollbar-hide">
            <CardComponent categories={menuItems} title="" />
          </div>
        </div>
        <div className="container mx-auto px-4 mt-10">
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold ml-10">Top Brands </h1>
            <p className="text-gray-500 ml-10">
              These are the top picks from our chefs
            </p>
          </div>
          <div className="flex gap-8 overflow-x-auto  scrollbar-hide">
            <div className="flex gap-8 ">
              {restaurantDetails.length > 0 && restaurantDetails.map((category) => (
                <Card className="w-[300px] h-[400px] flex flex-col items-center justify-center border-0 shadow-lg rounded-lg">
                  <CardHeader>
                    <img
                      src={category.RestaurantImage}
                      alt={category.name}
                      className="w-full h-[250px] object-cover rounded-[50%]"
                    />
                    <CardTitle className="text-center mt-4">
                      {category.Name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <section className="flex flex-col mx-auto px-4 mt-14 mb-10 ml-0 lg:ml-30">
        <div className="flex flex-col px-4 mt-14 mx-auto  w-full mb-10">
          <div className="flex flex-col mb-4">
            <h1 className="text-2xl font-bold">For You</h1>
            <p className="text-gray-500">
              These are the top picks from our chefs
            </p>
          </div>
          <div className="flex flex-wrap items-center  w-full gap-3.5 p-2">
            {filterButtons.map((button) => (
              <Button key={button.id} onClick={(e) => handlefilter(button.filterType, button.value)} className="flex itemsm-center gap-2">
                {button.icon}
                {button.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 w-full ml-10 lg:ml-0">
          {menuItems && menuItems.map((menu) => (
            <MenuComponent key={menu.id} menu={menu} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Menu;
