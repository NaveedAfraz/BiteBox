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
import { Menu, Star, Clock, Phone, MapPin, Users } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import ItemCard from "@/components/ItemCard";
import useFilteredItems from "@/hooks/Restaurant/useSort";
import { useEffect, useRef, useState } from "react";
import useRestaurant from "@/hooks/Restaurant/useRestaurant";

function Restaurant() {
  const [searchParams] = useSearchParams();
  const restaurantID = searchParams.get("ID");
  const menu = [
    { id: 1, name: "All", restaurantId: restaurantID },
    { id: 2, name: "pizza", restaurantId: restaurantID },
    { id: 3, name: "burger", restaurantId: restaurantID },
    { id: 4, name: "Salad", restaurantId: restaurantID },
    { id: 5, name: "Drink", restaurantId: restaurantID },
  ];
  const [Error, setError] = useState();

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

  const { fetchOneRestaurant } = useRestaurant();
  const { data: restaurant, isLoading, error } = fetchOneRestaurant(restaurantID);

  const [items, setItems] = useState();
  const [Index, setIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState(null);

  useEffect(() => {
    if (restaurant && (restaurant.items && restaurant.items.length == 0)) {
      setItems(restaurant.items);
    } else if (Index == 0) {
      const filtered = filteredItems?.data.filter((restaurant) => restaurant.restaurantID == restaurantID);
      setItems(filtered);
    }
    if (isError) {
      setItems("");
    }
  }, [restaurant, restaurant?.items, Index, isError, filteredItems]);

  const handlefilterBTN = function (item, index) {
    setIndex(index);
    if (filteredItems) {
      const filteredItemsMenuBtn = filteredItems.data.filter((Item) => 
        Item.category === item.name && Item.restaurantID == item.restaurantId
      );
      setItems(filteredItemsMenuBtn);
      setSelectedFilter(item);
    }
    setSelectedFilter(item);
    refetch();
  };

  useEffect(() => {
    if (selectedFilter) {
      handlefilterBTN({ name: selectedFilter.name, restaurantId: restaurantID }, Index);
    }
  }, [selectedFilter, filteredItems, restaurant?.items]);

  useEffect(() => {
    const checkStatus = () => {
      const result = filteredItems?.data.every((item) => item.status == "pending");
      if (result) {
        setError("No Items Found");
      } else {
        setError(null);
      }
      return result;
    };
  }, [filteredItems?.data]);

  const {
    Name,
    Cuisine,
    OpeningHours,
    ClosingHours,
    PhoneNumber,
    RestaurantImage
  } = restaurant?.restaurant || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Restaurant Info */}
      <div className="relative bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-gray-600 hover:text-gray-900">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/hyderabad" className="text-gray-600 hover:text-gray-900">Hyderabad</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-gray-900 font-medium">{Name}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Restaurant Header Card */}
          <Card className="overflow-hidden w-[70%] border-0 shadow-lg">
            <div className="relative">
              <div className="h-64 md:h-80 overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  src={RestaurantImage}
                  alt={Name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              
              {/* Floating Info Card */}
              <div className="absolute -bottom-8 left-6 right-6 bg-white rounded-2xl shadow-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{Name}</h1>
                      <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        <Star className="w-4 h-4 fill-current mr-1" />
                        <span className="font-semibold text-sm">4.2</span>
                        <span className="text-xs ml-1">(320)</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{Cuisine}</p>
                    
                    {/* Quick Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-700">
                        <Users className="w-4 h-4 mr-2" />
                        <span>₹500 for two</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{OpeningHours} - {ClosingHours}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{PhoneNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-16 pb-8">
        {/* Special Offers Section */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 w-1 h-8 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900">Special Offers</h2>
          </div>
          <SpecialCard specialOffers={specialOffers} restaurantPage={true} />
        </section>

        {/* Menu Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-1 h-8 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Menu className="w-6 h-6" />
              Menu
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Menu Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {menu.map((item, index) => (
                      <Button
                        key={item.id}
                        variant="ghost"
                        className={`w-full justify-start text-left p-4 rounded-none border-l-4 transition-all duration-200 ${
                          index === Index 
                            ? "bg-red-50 border-l-red-500 text-red-700 font-semibold" 
                            : "border-l-transparent hover:bg-gray-50 hover:border-l-gray-300"
                        }`}
                        onClick={() => handlefilterBTN(item, index)}
                      >
                        {item.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="mb-6 border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {filterButtons.map((button) => (
                      <Button
                        key={button.id}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleFilter(button.filterType, button.value, button.order)
                        }
                        className={`transition-all duration-200 ${
                          (button.filterType === "foodType" && button.value === foodType) ||
                          (button?.filterType === "sort" &&
                            button?.value === sort &&
                            button.order === order)
                            ? "bg-orange-500 text-white border-orange-600 hover:bg-orange-700"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {button.icon}
                        <span className="ml-2">{button.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

            
              <div className="min-h-96">
                {!loading && items && items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item) => (
                      <ItemCard key={item.id} item={item} loading={loading} Error={Error} />
                    ))}
                  </div>
                ) : !isError && items?.length !== 0 ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" />
                  </div>
                ) : (
                  <Card className="border-0 shadow-md">
                    <CardContent className="flex flex-col items-center justify-center py-20">
                      <div className="text-gray-400 mb-4">
                        <Menu className="w-16 h-16" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Items Found</h3>
                      <p className="text-gray-500 text-center">
                        Try adjusting your filters or check back later for new items.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Restaurant;