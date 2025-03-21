import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurantDetails: {},
  menuItems: [],
  review: [],
  orderReviewItemID: {},
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurantDetails: (state, action) => {
      console.log(action.payload, "setRestaurantDetails");
      state.restaurantDetails = action.payload;
    },
    setMenuItems: (state, action) => {
      console.log(action.payload, "setRestaurantDetails");
      state.menuItems = action.payload;
    },
    orderReviewItem: (state, action) => {
      console.log(action.payload, "orderReviewItem");
      state.orderReviewItemID = action.payload;
    },
  },
});

export const { setRestaurantDetails, setMenuItems,orderReviewItem } = restaurantSlice.actions;

export default restaurantSlice.reducer;
