import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Check, X } from 'lucide-react'
import { Chart } from '../ui/charts'
import useOrders from '@/hooks/Restaurant/useOrder'
import useRestaurant from '@/hooks/Restaurant/useRestaurant'
import { useSelector } from 'react-redux'

function OrderList() {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  const [items, setItems] = useState([])
  const [restrudents, setRestrudents] = useState([])

  const { fetchRestaurant } = useRestaurant();
  //console.log(userRole);

  const {
    approveOrder,
    rejectOrder
  } = useOrders();


  const { data: restaurantData, refetch
  } = fetchRestaurant({ userID: userInfo?.userId });
  console.log(restaurantData);
  useEffect(() => {
    if (restaurantData?.orders) {
      setItems(restaurantData?.orders)
      setRestrudents(restaurantData?.restaurant)
    }
  }, [restaurantData.orders])


  const handleAccept = (id) => {
    console.log(`Accepted order ${id}`)
    approveOrder({ orderId: id, status: "delivered" });
    setTimeout(() => {
      refetch();
    }, 1000)
  }

  const handleReject = (id) => {
    console.log(`Rejected order ${id}`)
    rejectOrder({ orderId: id, status: "rejected" });
    setTimeout(() => {
      refetch();
    }, 1000)
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
        <Chart
          type="donut"
          data={[
            { name: "Completed", value: 400 },
            { name: "Pending", value: 300 },
            { name: "Cancelled", value: 150 }
          ]}
          colors={["#00C49F", "#FFBB28", "#FF8042"]}

        />
      </div>
      {items.length > 0 && items.map((item, index) => {
        return (
          <Card key={item.id} className="overflow-hidden shadow-sm">
            <div className="flex items-center justify-between py-2 px-4">
              <div className="flex flex-1 items-center">
                <div className="mr-4">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-600">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base truncate">Anonymous</CardTitle>
                    <span className="text-sm font-medium text-gray-900 ml-2">{item.status}</span>
                  </div>
                  <CardDescription className="text-xs truncate mt-0.5">
                    {item.description}
                  </CardDescription>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Submitted: {item.orderDate}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {item.status == "pending" &&
                  <>   <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => handleReject(item.orderID)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => handleAccept(item.orderID)}
                    >
                      <Check className="h-4 w-4" />
                    </Button></>}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default OrderList