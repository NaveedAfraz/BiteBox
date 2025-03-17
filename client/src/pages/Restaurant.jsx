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
    { id: 1, name: "Pizza", price: 100 },
    { id: 2, name: "Burger", price: 50 },
    { id: 3, name: "Salad", price: 20 },
    { id: 4, name: "Soda", price: 10 },
  ];

  const {
    search,
    sort,
    order,
    foodType,
    handleFilter,
    data: filteredItems,
    isError,
  } = useFilteredItems();



  const [searchParams] = useSearchParams();
  const restaurantID = searchParams.get("ID");
  const { fetchOneRestaurant } = useRestaurant();

  const { data: restaurant, isLoading, error } = fetchOneRestaurant(restaurantID);
  const [items, setItems] = useState()
  useEffect(() => {
    if (restaurant && (filteredItems && filteredItems.length == 0)) {


      setItems(restaurant.items)
    } else {
      console.log("runing");
      console.log(filteredItems);

      setItems(filteredItems?.data)
    }
  }, [restaurant, filteredItems])
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(items);
  // console.log(restaurant);


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
                  {restaurant.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Restaurant Details Card */}
        <section className="container mx-auto px-4">
          <Card className="border border-gray-200 shadow-md rounded-lg p-4">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {restaurant.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-2">
              <div className="text-gray-700 text-sm flex items-center space-x-2">
                <span className="text-green-600 font-semibold">
                  {restaurant.rating}
                </span>
                <span>({restaurant.ratingCount} ratings)</span>
                <span className="mx-1">•</span>
                <span>₹{restaurant.priceForTwo} for two</span>
              </div>

              <div className="text-sm">
                <span className="text-red-500 font-medium">
                  {restaurant?.cuisines?.join(", ")}
                </span>
              </div>

              <div className="text-sm flex items-center space-x-2">
                <span>Outlet {restaurant.location}</span>
                <span className="mx-1">•</span>
                <span>{restaurant?.time}</span>
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
              <div className="rounded-lg p-4 flex flex-col gap-2 w-[20%] shadow-md  md:w-[40%] lg:w-[40%]">
                {menu.map((item) => (
                  <Button
                    key={item.id}
                    variant="transparent"
                    className="border-b-4 border-gray-200"
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
                <div className="w-full min-h-">
                  {items && items.length > 0 && items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
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
