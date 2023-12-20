import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASEURL from "../../api/axiosInstance";

const initialState = {
  messages: [],
  loading: "idle",
  error: null,
};

export const sendMessage = createAsyncThunk(
  "auth/sendMessage",
  async ({ data, socket }, { getState }) => {
    try {
      const response = await axios.post(`${BASEURL}/message`, data, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      socket.emit("new message", response.data);
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error.response.data.message;
    }
  }
);

export const allMessages = createAsyncThunk(
  "auth/allMessages",
  async (chatId, { getState }) => {
    try {
      const response = await axios.get(`${BASEURL}/message/${chatId}`, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error.response.data.message;
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    receiveMessage: (state, action) => {
      state.messages.push(action.payload); 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(allMessages.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(allMessages.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.messages = action.payload;
      })
      .addCase(allMessages.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

const messageReducer = messageSlice.reducer;
const messageActions = {
  sendMessage,
  allMessages,
};

export { messageActions, messageReducer };
export const {receiveMessage } = messageSlice.actions;
