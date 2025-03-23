import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurantDetails: {},
  menuItems: [],
  review: [],
  orderReviewItemID: {},
  orderIDs: [],
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
    setOrderIDs: (state, action) => {
      console.log(action.payload, "setOrderIDs");
      state.orderIDs = action.payload;
    },
  },
});

export const {
  setRestaurantDetails,
  setMenuItems,
  orderReviewItem,
  setOrderIDs,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
