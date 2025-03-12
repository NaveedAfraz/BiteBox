import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  toggleAuth: "login",
 // userRole: null,
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
  },
});

export const { toggleAuthState } = authSlice.actions;

export default authSlice.reducer;
