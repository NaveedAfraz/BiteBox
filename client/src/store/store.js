import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import restaurantReducer from "./restaurant";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    restaurant: restaurantReducer,
  },
});
