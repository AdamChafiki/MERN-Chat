import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASEURL from "../../api/axiosInstance";

const initialState = {
  notification: [],
  loading: "idle",
  error: null,
};

// do it after

// export const fetch notifcation = createAsyncThunk(
//   "auth/searchUser",
//   async (key, { getState }) => {
//     try {
//       const response = await axios.get(`${BASEURL}/user?search=${key}`, {
//         headers: {
//           Authorization: `Bearer ${getState().auth.user.token}`,
//         },
//       });
//       return response.data.users;
//     } catch (error) {
//       console.error("Error:", error.message);
//       throw error.response.data.message;
//     }
//   }
// );

const notifSlice = createSlice({
  name: "notif",
  initialState,
  reducers: {
    addNotif: (state, action) => {
      state.notification.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder;
  },
});

const notifReducer = notifSlice.reducer;
const notifActions = {};

export { notifActions, notifReducer };
export const { addNotif } = notifSlice.actions;
