import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import friendsReducer from "./friendsSlice";
import notificationReducer from "./notificationSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    friends: friendsReducer,
    notifications: notificationReducer
  },
});
