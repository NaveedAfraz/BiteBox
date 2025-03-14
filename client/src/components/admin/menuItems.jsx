import React from 'react'
import { categories } from "../../config/details";
import MenuComponent from '@/components/menuComponent'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CardComponent from './CardComponent';
import { useSelector } from 'react-redux';
function MenuItems() {
  const { menuItems } = useSelector(state => state.restaurant)
  console.log(menuItems);

  console.log(categories)
  return (
    <>
      <div className='flex items-center justify-center'>
        <CardComponent title="AddItems" item="" />
      </div>
      <div className="flex flex-wrap gap-4 w-full ml-10 lg:ml-0">
        {menuItems.length !== 0 ? menuItems.map((menu) => (
          <MenuComponent key={menu.id} menu={menu} />
        )) : <p className="text-center text-lg w-full mt-2.5 text-gray-500">No Menu Items</p>}
      </div>
    </>
  )
}

export default MenuItems
