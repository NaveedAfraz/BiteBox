import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SpecialCard from "@/components/SpecialCard";
import { filterButtons, specialOffers } from "@/config/details";
import { Menu } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import ItemCard from "@/components/ItemCard";
import useFilteredItems from "@/hooks/Restaurant/useSort";
import { useEffect, useRef, useState } from "react";
import useRestaurant from "@/hooks/Restaurant/useRestaurant";
function Restaurant() {

  const menu = [
    { id: 1, name: "All" },
    { id: 2, name: "pizza", price: 100 },
    { id: 3, name: "burger", price: 50 },
    { id: 4, name: "Salad", price: 20 },
    { id: 5, name: "Drink", price: 10 },
  ];
  const [Error, setError] = useState()

  const {
    search,
    sort,
    order,
    foodType,
    handleFilter,
    data: filteredItems,
    isError,
    isLoading: loading,
    refetch
  } = useFilteredItems();
  // console.log(filteredItems);

  const [searchParams] = useSearchParams();
  const restaurantID = searchParams.get("ID");
  const { fetchOneRestaurant } = useRestaurant();

  const { data: restaurant, isLoading, error } = fetchOneRestaurant(restaurantID);

  console.log(restaurant);

  const [items, setItems] = useState()
  const [Index, setIndex] = useState()
  const [selectedFilter, setSelectedFilter] = useState(null);
  useEffect(() => {
    if (restaurant && (restaurant.items && restaurant.items.length == 0)) {
      setItems(restaurant.items)
    } else if (Index === undefined) {
      // console.log(filteredItems);

      const filtered = filteredItems?.data.filter((restaurant) => restaurant.restaurantID == restaurantID)
      // console.log(filtered);

      setItems(filtered)
    }
    if (isError) {
      setItems("")
    }
    if (!isError) {

    }
  }, [restaurant, restaurant?.items, Index, isError, filteredItems])

  // if (loading) return <div>Loading</div>
  // console.log(items);
  // console.log(restaurant);
  //console.log(isError);

  console.log(items);

  const handlefilterBTN = function (item, index) {
    // console.log(false);
    // console.log(index);
    setIndex(index)
    // console.log(items);

    //console.log(item);
    if (restaurant.items && item.name != "All") {
      const filteredItemsMenuBtn = restaurant.items.filter((Item) => Item.category === item.name
      )

      //  console.log(filteredItemsMenuBtn);
      setItems(filteredItemsMenuBtn)
      setSelectedFilter(item.name);
    }
    setSelectedFilter(item.name)
    refetch()
  }
  //console.log(items);
  // console.log(Index);

  useEffect(() => {
    if (selectedFilter) {
      console.log(selectedFilter.name);
      handlefilterBTN({ name: selectedFilter }, Index);
    }
    //console.log("m");

    if (Index === 0) {
      console.log("index is empty");

      setItems(restaurant.items)
    }
  }, [selectedFilter, filteredItems, restaurant?.items]);
  //console.log(restaurant);
  // if (isLoading) return <div>loign....</div>;
  useEffect(() => {
    const checkStatus = () => {
      const result = filteredItems?.data.every((item) => item.status == "pending")
      if (result) {
        setError("No Items Found")
      } else {
        setError(null)
      }
      return result;
    }
    console.log(checkStatus(), "..");
  }, [filteredItems?.data])

  if (loading) return <div>Loading...</div>;
  const {
    Name,
    Cuisine,
    OpeningHours,
    ClosingHours,
    PhoneNumber,
    RestaurantImage
  } = restaurant?.restaurant || {};


  //  if (Error) {
  //    return <div>Error: {Error}</div>;
  //  }
  // if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="min-h-screen flex flex-col">
      <main className="pt-24 flex-grow">
        {/* Top Container with Title & Breadcrumb */}
        <div className="container mx-auto px-4 relative mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {/* Example city/location */}
              <BreadcrumbItem>
                <BreadcrumbLink href="/hyderabad">Hyderabad</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/restaurants">
                  {restaurant?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <section className="container mx-auto px-4">
          <Card className="max-w-3xl overflow-hidden">
            <div className="relative w-full h-48 overflow-hidden">
              <img
                className="w-[80%] h-full object-cover"
                src={RestaurantImage}
                alt="Restaurant"
              />
              <div className="absolute top-0 right-0 w-[20%] h-full bg-gradient-to-l from-orange-500 to-transparent"></div>
            </div>

            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{Name}</CardTitle>
                <div className="flex items-center">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">4.2</span>
                  <span className="text-xs text-gray-500 ml-1">(320 ratings)</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{Cuisine}</p>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <span className="text-sm">₹500 for two</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">Outlet Location</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <div>Hours: {OpeningHours} - {ClosingHours}</div>
                  <div>Phone: {PhoneNumber}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4">
            <h1 className="text-2xl font-bold flex ml-4 items-center mb-6 mt-10">
              Special Offers
            </h1>
            <SpecialCard specialOffers={specialOffers} restaurantPage={true} />
          </div>
          <div className="mt-4 flex flex-col gap-4">
            <h1 className="text-2xl font-bold flex ml-4 items-center mb-6 mt-10">
              <Menu className="mr-2" />
              Menu
            </h1>
            <div className="flex flex-row p-4 gap-4">
              <div className="rounded-lg p-4 flex flex-col gap-2 w-[0%] shadow-md  md:w-[40%] lg:w-[20%]">
                {menu.map((item, index) => (
                  <Button
                    key={item.id}
                    variant="transparent"
                    className={`border-b-4 p-6 border-gray-200 ${index == Index ? "bg-red-500" : "solid"}`}
                    onClick={() => handlefilterBTN(item, index)}
                  >
                    <h2 className="text-lg font-semibold mt-2">{item.name}</h2>
                  </Button>
                ))}
              </div>
              <div className="">
                <h2 className="text-xl font-semibold mt-2 ml-3">Filter</h2>
                <div className="flex flex-wrap items-center  w-full gap-3.5 p-2">
                  {filterButtons.map((button) => (
                    <Button
                      variant="primary"
                      key={button.id}
                      onClick={() =>
                        handleFilter(button.filterType, button.value, button.order)
                      }
                      className={`flex items-center gap-2 ${(button.filterType === "foodType" && button.value === foodType) ||
                        (button?.filterType === "sort" &&
                          button?.value === sort &&
                          button.order === order)
                        ? "bg-green-900"
                        : "default"
                        }`}
                    >
                      {button.icon} {button.name}
                    </Button>
                  ))}
                </div>
                <div className="w-full min-h-52 h-screen mt-8">
                  {!loading && items && items.length > 0 ? items.map((item) => (
                    <ItemCard key={item.id} item={item} loading={loading} Error={Error} />
                  )) : (!isError && items?.length != 0 ? <div className="animate-spin mx-auto mt-15 rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-12"></div> : <div className="mt-10 text-center">
                    <p className="mt-20 font-bold">No Items Found</p>
                  </div>)
                  }
                  {/* {items?.length === 0 && <div className=""> item not there of this cat</div>} */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Restaurant;
