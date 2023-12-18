import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { userReducer } from "./slices/userSlice";
import { chatReducer } from "./slices/chatSlice";
import { messageReducer } from "./slices/messageSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    chat: chatReducer,
    message: messageReducer,
  },
});
