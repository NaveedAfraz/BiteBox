import React from 'react'
import { categories } from "../../config/details";
import MenuComponent from '@/components/menuComponent'
function MenuItems() {
  console.log(categories)
  return (
    <div className="flex flex-wrap gap-4 w-full ml-10 lg:ml-0">
      {categories.map((menu) => (
        <MenuComponent key={menu.id} menu={menu} />
      ))}
    </div>
  )
}

export default MenuItems