import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card'
import React from 'react'
import { Star, Trash2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import useRestaurant from '@/hooks/Restaurant/useRestaurant'

function Restaurants() {
  const { fetchAllRestaurant, deleteRestaurant } = useRestaurant()
  const { userInfo } = useSelector((state) => state.auth);
  const { data: AllRestaurant } = fetchAllRestaurant()

  const handleDeleteRestaurant = (restaurantID) => {
    deleteRestaurant.mutate({ restaurantID });
    console.log(restaurantID)
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AllRestaurant?.data.map((restaurant) => (
          <Card key={restaurant.restaurantID} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              {restaurant.RestaurantImage ? (
                <img
                  src={restaurant.RestaurantImage}
                  alt={restaurant.Name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="flex justify-between items-start mb-2">
                <span>{restaurant.Name}</span>
                {restaurant.rating && (
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <Star className="h-4 w-4 fill-current" />
                    {restaurant.rating}
                  </div>
                )}
              </CardTitle>

              <div className="text-sm text-gray-600 mt-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Cuisine:</span>
                  <span>{restaurant.Cuisine || "Not specified"}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">Hours:</span>
                  <span>{restaurant.OpeningHours} - {restaurant.ClosingHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{restaurant.PhoneNumber}</span>
                </div>
              </div>

              {userInfo && userInfo.role === "admin" && (
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteRestaurant(restaurant.restaurantID)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Restaurants