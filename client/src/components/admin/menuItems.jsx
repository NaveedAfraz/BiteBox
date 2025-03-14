import React, { useActionState } from 'react'
import { categories } from "../../config/details";
import MenuComponent from '@/components/menuComponent'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CardComponent from './CardComponent';
import { useSelector } from 'react-redux';
import useRestaurant from '@/hooks/Restaurant/useRestaurant';
function MenuItems() {
  const { menuItems } = useSelector(state => state.restaurant)
  console.log(menuItems);
  const { addItem } = useRestaurant()
  let initialState = null;
  const handleSubmit = (prevState, formData) => {
    console.log(prevState);
    const itemData = {
      name: formData.get("name"),
      price: formData.get("price"),
      quantity: formData.get("quantity"),
      category: formData.get("category"),
      description: formData.get("description"),
      photo: formData.get("photo")?.name || null,  
    };
    console.log(itemData);
    
    return {
      message: "Item added successfully!",
      itemData: itemData
    };
  }
  const [state, formAction, isPending] = useActionState(handleSubmit, initialState)

  return (
    <>
      <div className='flex items-center justify-center'>
        <CardComponent title="AddItems" item="" formAction={formAction} />
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
