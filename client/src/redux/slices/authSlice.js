import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";
import BASEURL from "../../api/axiosInstance";
const initialState = {
  user: null || JSON.parse(localStorage.getItem("user")),
  loading: "idle",
  error: null,
};

// Async thunk to handle user logout
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  return null;
});

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password, setError, nav }) => {
    try {
      const response = await axios.post(`${BASEURL}/auth/login`, {
        email,
        password,
      });

      setError(null);
      localStorage.setItem("user", JSON.stringify(response.data));
      nav("/");
      return response.data;
    } catch (error) {
      console.error("Login Error:", error.response.data.message);
      setError(error.response.data.message);
      throw error.response.data.message;
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData) => {
    try {
      const response = await axios.post(`${BASEURL}/auth/register`, userData);
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      console.error("Registration Error:", error.message);
      throw error.response.data.message;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.user = action.payload;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

const authReducer = authSlice.reducer;
const authActions = {
  loginUser,
  registerUser,
  logoutUser,
};

export { authActions, authReducer };
// export const { } = authSlice.actions;
