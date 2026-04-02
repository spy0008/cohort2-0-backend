import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
    isSending: false,
    isFetchingChats: false,
    isDeleting: false,
    error: null,
  },
  reducers: {
    setChat: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setSending: (state, action) => {
      state.isSending = action.payload;
    },
    setFetchingChats: (state, action) => {
      state.isFetchingChats = action.payload;
    },
    setDeleting: (state, action) => {
      state.isDeleting = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;

      state.chats[chatId] = {
        id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;

      state.chats[chatId].messages.push({ content, role });
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.chats[chatId].messages = messages;
    },
    deleteChatLocal: (state, action) => {
      const chatId = action.payload;
      delete state.chats[chatId];

      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }
    },
  },
});

export const {
  setChat,
  setCurrentChatId,
  setSending,
  setFetchingChats,
  setDeleting,
  setError,
  createNewChat,
  addNewMessage,
  deleteChatLocal,
  addMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
