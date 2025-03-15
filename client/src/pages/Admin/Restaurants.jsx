import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card'
import React, { useEffect } from 'react'
import { Star, Trash2 } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import useRestaurant from '@/hooks/Restaurant/useRestaurant'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'

function Restaurants() {
  const { fetchAllRestaurant } = useRestaurant()
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  const { data: AllRestaurant } = fetchAllRestaurant()



  // const restaurants = [
  //   {
  //     id: 1,
  //     name: 'Tasty Burger House',
  //     description: 'Authentic American burgers & fries',
  //     image: 'https://source.unsplash.com/800x600/?burger',
  //     rating: 4.5,
  //   },
  //   {
  //     id: 2,
  //     name: 'Sushi Master',
  //     description: 'Fresh Japanese sushi & sashimi',
  //     image: 'https://source.unsplash.com/800x600/?sushi',
  //     rating: 4.8,
  //   },
  //   {
  //     id: 3,
  //     name: 'Pizza Paradise',
  //     description: 'Wood-fired Italian pizzas',
  //     image: 'https://source.unsplash.com/800x600/?pizza',
  //     rating: 4.3,
  //   },
  //   {
  //     id: 4,
  //     name: 'Taco Fiesta',
  //     description: 'Mexican street food specialists',
  //     image: 'https://source.unsplash.com/800x600/?tacos',
  //     rating: 4.6,
  //   },
  //   {
  //     id: 5,
  //     name: 'Noodle World',
  //     description: 'Asian noodle dishes & soups',
  //     image: 'https://source.unsplash.com/800x600/?noodles',
  //     rating: 4.4,
  //   },
  // ]
console.log(AllRestaurant);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AllRestaurant?.data.map((restaurant) => (
          <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <img
                src={restaurant.RestaurantImage}
                alt={restaurant.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="flex justify-between items-start">
                <span>{restaurant.name}</span>
                <div className="flex items-center gap-1 text-sm text-amber-600">
                  <Star className="h-4 w-4 fill-current" />
                  {restaurant.rating}
                </div>
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600">
                {restaurant.description}
              </CardDescription>
            </CardContent>
            <div>
              {userInfo && (
                <Button
                  onClick={() => {
                    // handleDeleteRestaurant(restaurant.id)
                  }}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Restaurants