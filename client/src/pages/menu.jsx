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
  const [searchParams, setSearchParams] = useSearchParams()
  const [type, setType] = useState("")
  
  useEffect(() => {
    console.log("Menu component rendering");
  }, [])

  const handlefilter = ({ e, button }) => {
    console.log(button, "filter");


    // let i = 0
    // let newStr
    // // console.log(i, "filter");
    // for (i in category) {
    //   if (category[i] === " ") {
    //     console.log("filter", category.slice(0, i));
    //     newStr = category.slice(0, i -1) + category.slice(i + 1)
    //     console.log(newStr, "filter");
    //   }
    // }
    // console.log(category, "filter");

    let category = e.target.textContent.trim();
    let newStr = category.split(" ").join("");

    // Read existing categories from query param
    let existingCategory = searchParams.get("category");
    let categoriesArray = existingCategory ? existingCategory.split(",") : [];

    // Define opposite filter pairs
    const oppositeFilters = {
      "A-Z": "Z-A",
      "Z-A": "A-Z",
      "Price(HightoLow)": "Price(LowtoHigh)",
      "Price(LowtoHigh)": "Price(HightoLow)",
    };

    // 1. Remove opposite if present
    const opposite = oppositeFilters[newStr];
    if (opposite && categoriesArray.includes(opposite)) {
      categoriesArray = categoriesArray.filter((item) => item !== opposite);
    }

    // 2. If new filter is already in array, remove it (toggle off)
    if (categoriesArray.includes(newStr)) {
      categoriesArray = categoriesArray.filter((item) => item !== newStr);
    } else {
      // 3. Otherwise, add it
      categoriesArray.push(newStr);
    }



    let sortBy = "name";
    let orderBy = "asc";

    if (newStr === "A-Z") {
      sortBy = "name";
      orderBy = "asc";
    } else if (newStr === "Z-A") {
      sortBy = "name";
      orderBy = "desc";
    } else if (newStr === "Price(HightoLow)") {
      sortBy = "price";
      orderBy = "desc";
    } else if (newStr === "Price(LowtoHigh)") {
      sortBy = "price";
      orderBy = "asc";
    } else {
      setType(newStr);
    }

    searchParams.set("category", categoriesArray.join(","));
    setSearchParams(searchParams);
    console.log(newStr, "filter");
  }
  console.log(type, "filter");

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
              <Button key={button.id} onClick={(e) => handlefilter({ e, button })} className="flex itemsm-center gap-2">
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
