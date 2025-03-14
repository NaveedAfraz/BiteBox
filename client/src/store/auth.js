import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toggleAuth: "login",
  // userRole: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleAuthState: (state, action) => {
      console.log(action.payload);
      state.toggleAuth = action.payload;
    },
    // userRole: (state, action) => {
    //   state.userRole = action.payload;
    // },
    userDetails: (state, action) => {
      console.log(action.payload);
      state.userInfo = action.payload;
      console.log(state.userInfo);
    },
  },
});

export const { toggleAuthState, userDetails } = authSlice.actions;

export default authSlice.reducer;
