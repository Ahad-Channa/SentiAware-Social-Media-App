import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import friendsReducer from "./friendsSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer
  },
});
