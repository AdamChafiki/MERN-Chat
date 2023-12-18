import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASEURL from "../../api/axiosInstance";

const initialState = {
  users: [],
  loading: "idle",
  error: null,
};

export const searchUser = createAsyncThunk(
  "auth/searchUser",
  async (key, { getState }) => {
    try {
      const response = await axios.get(`${BASEURL}/user?search=${key}`,{
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      return response.data.users;
    } catch (error) {
      console.error("Error:", error.message);
      throw error.response.data.message;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchUser.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.users = action.payload;
      })
      .addCase(searchUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

const userReducer = userSlice.reducer;
const userActions = {
  searchUser,
};

export { userActions, userReducer };
// export const { } = authSlice.actions;
