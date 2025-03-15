import React, { useActionState } from 'react'
import { categories } from "../../config/details";
import MenuComponent from '@/components/menuComponent'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CardComponent from './CardComponent';
import { useSelector } from 'react-redux';
import useRestaurant from '@/hooks/Restaurant/useRestaurant';
function MenuItems() {
  const { menuItems, restaurantDetails } = useSelector(state => state.restaurant);
  // console.log(restaurantDetails);
  const { fetchRestaurant, deleteRestaurant } = useRestaurant()
  // console.log(menuItems);

  // const { refetch } = fetchRestaurant()
  const { addItem } = useRestaurant();
  const [imageUrl, setImageUrl] = React.useState(null);
  const [message, setMessage] = React.useState('');

  const CLOUD_NAME = 'dvntoejlv';
  const UPLOAD_PRESET = 'bitebox_menu_items';

  const handleImageUpload = async (file) => {
    if (!file) return null;

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', UPLOAD_PRESET);

    try {
      setMessage('Uploading image...');
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: data }
      );

      const result = await response.json();
      if (result.secure_url) {
        setImageUrl(result.secure_url);
        return result.secure_url;
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Failed to upload image.');
      return null;
    }
  };

  const handleSubmit = async (prevState, formData) => {
    try {
      const photoFile = formData.get('photo');
      let imageUrl = null;

      if (photoFile.size > 0) {
        imageUrl = await handleImageUpload(photoFile);
        if (!imageUrl) throw new Error('Image upload failed');
      }

      const itemData = {
        name: formData.get("name"),
        price: Number(formData.get("price")),
        quantity: Number(formData.get("quantity")),
        category: formData.get("category"),
        description: formData.get("description"),
        foodType: formData.get("foodType"),
        photoUrl: imageUrl,
        restaurantID: restaurantDetails.restaurantID,
      };

      addItem.mutate(itemData)
      // setTimeout(() => { refetch() }, 1000)
      return { message: "Item added successfully!", error: null };

    } catch (error) {
      console.error('Submission error:', error);
      return { message: null, error: error.message };
    }
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

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
