import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurantDetails: {},
  menuItems: [],
  review: [],
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurantDetails: (state, action) => {
      state.restaurantDetails = action.payload;
    },
    setMenuItems: (state, action) => {
      state.menuItems = action.payload;
    },
  },
});

export const { setRestaurantDetails, setMenuItems } = restaurantSlice.actions;

export default restaurantSlice.reducer;
