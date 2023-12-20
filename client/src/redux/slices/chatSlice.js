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
  async ({ data, onClose }, { getState }) => {
    try {
      const response = await axios.post(`${BASEURL}/chat/group`, data, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      onClose();
      return response.data;
    } catch (error) {
      console.log(error);
      console.error("Error:", error.message);
      throw error.response.data.message;
    }
  }
);

export const renameGroupChat = createAsyncThunk(
  "chat/renameGroupChat",
  async ({ data, onClose, fetchChats }, { getState, dispatch }) => {
    try {
      const response = await axios.put(`${BASEURL}/chat/group/rename`, data, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      dispatch(fetchChats());
      onClose();
      return response.data;
    } catch (error) {
      console.log(error);
      console.error("Error:", error.message);
      throw error.response.data.message;
    }
  }
);


export const addUserToGroup = createAsyncThunk(
  "chat/addUserToGroup",
  async ({ userData, toast }, { getState }) => {
    try {
      const response = await axios.put(`${BASEURL}/chat/group/add`, userData, {
        headers: {
          Authorization: `Bearer ${getState().auth.user.token}`,
        },
      });
      toast({
        title: "User was added !",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return response.data;
    } catch (error) {
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
      })
      .addCase(renameGroupChat.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(renameGroupChat.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.selectedChat.chatName = action.payload.chatName;
      })
      .addCase(renameGroupChat.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(addUserToGroup.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(addUserToGroup.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.selectedChat.chatName = action.payload.chatName;
      })
      .addCase(addUserToGroup.rejected, (state, action) => {
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
  renameGroupChat,
  addUserToGroup,
};

export { chatActions, chatReducer };
export const { curretChat } = chatSlice.actions;
