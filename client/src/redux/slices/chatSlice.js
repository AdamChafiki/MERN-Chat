import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import BASEURL from "../../api/axiosInstance";

const initialState = {
  chats: [],
  selectedChat: null,
  loading: "idle",
  error: null,
};

export const accessChat = createAsyncThunk(
  "chat/accessChat",
  async (userId, { getState }) => {
    try {
      const response = await axios.post(
        `${BASEURL}/chat`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${getState().auth.user.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      throw error.response.data.message;
    }
  }
);

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_p, { getState }) => {
    try {
      const response = await axios.get(`${BASEURL}/chat`, {
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

export const createGroupChat = createAsyncThunk(
  "chat/createGroupChat",
  async (data, { getState }) => {
    try {
      const response = await axios.post(`${BASEURL}/chat/group`, data, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      console.error("Error:", error.message);
      throw error.response.data.message;
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    curretChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(accessChat.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(accessChat.fulfilled, (state, action) => {
        state.loading = "succeeded";
        function isEqual(obj1, obj2) {
          return JSON.stringify(obj1) === JSON.stringify(obj2);
        }
        if (!state.chats.some((chat) => isEqual(chat, action.payload))) {
          state.chats.push(action.payload);
        } 
      })

      .addCase(accessChat.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchChats.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(createGroupChat.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.chats.unshift(action.payload);
      })
      .addCase(createGroupChat.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

const chatReducer = chatSlice.reducer;
const chatActions = {
  accessChat,
  fetchChats,
  createGroupChat,
};

export { chatActions, chatReducer };
export const { curretChat } = chatSlice.actions;
