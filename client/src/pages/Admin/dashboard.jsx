import CardComponent from '@/components/admin/CardComponent';
import { Chart } from '@/components/ui/charts';
import { DollarSign, ShoppingCart, Users, BarChart3 } from 'lucide-react';
import React, { useState } from 'react'

function Dashboard() {
  const title = "dashboardCard"
  const [isSuperAdmin, setIsSuperAdmin] = useState(true);

  const dashboardCards = [
    {
      title: isSuperAdmin ? "Total Restaurants" : "Today's Orders",
      value: isSuperAdmin ? "38" : "24",
      icon: isSuperAdmin ? BarChart3 : ShoppingCart,
      description: isSuperAdmin ? "from last month" : "from yesterday",
      trend: isSuperAdmin ? "+12.5%" : "+4.5%"
    },
    {
      title: "Total Revenue",
      value: "$4,250",
      icon: DollarSign,
      description: "from last month",
      trend: "+5.2%"
    },
    {
      title: isSuperAdmin ? "Registered Users" : "New Customers",
      value: isSuperAdmin ? "1,429" : "12",
      icon: Users,
      description: "from last month",
      trend: "+2.3%"
    },
    {
      title: isSuperAdmin ? "Pending Approvals" : "Completed Orders",
      value: isSuperAdmin ? "6" : "18",
      icon: ShoppingCart,
      description: "requiring attention",
      trend: isSuperAdmin ? "+3" : "+8.1%"
    }
  ];
  const registeredRestaurants = [
    { name: "Restaurant 1", joined: Date.now() },
    { name: "Restaurant 2", joined: Date.now() },
  ]
  return (
    <>   
      <div className='grid grid-cols-1 lg:grid-cols-4 ml-2 md:grid-cols-2'>
        {dashboardCards.map((item) => {
          return (
            <CardComponent item={item} title={title} />
          )
        })}
      </div>
      <div className='grid grid-cols-2 h-full mt-3'>
        <div className='w-full'>
          <h2 className='font-bold text-lg  ml-3 mb-3'>Charts</h2>
          <div className='h-[90vh]'>
            <Chart
              type="donut"
              data={[
                { name: "Completed", value: 400 },
                { name: "Pending", value: 300 },
                { name: "Cancelled", value: 150 }
              ]}
              colors={["#00C49F", "#FFBB28", "#FF8042"]}
            /></div>
        </div>
        <div>
          <h2 className='font-bold text-lg ml-3 mb-3'>Recent Activities</h2>
          {registeredRestaurants.map((restrus) => {
            return (
              <>
                <div className='bg-white p-4 rounded-md shadow-md m-2'>
                  {restrus.name}
                </div>
              </>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Dashboard