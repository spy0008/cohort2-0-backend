import { initializeSocketConnection } from "../services/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../services/chat.api.js";
import {
  setChat,
  setError,
  setSending,
  setDeleting,
  setFetchingChats,
  setCurrentChatId,
  createNewChat,
  addNewMessage,
  addMessages,
  deleteChatLocal,
} from "../chat.slice.js";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    try {
      dispatch(setSending(true));

      const data = await sendMessage({ message, chatId });
      const { aiMessage, chat } = data;

      const finalChatId = chatId || chat._id;

      if (!chatId) {
        dispatch(
          createNewChat({
            chatId: finalChatId,
            title: chat.title,
          }),
        );
      }

      // 👉 set active chat
      dispatch(setCurrentChatId(finalChatId));

      // 👉 add messages
      dispatch(
        addNewMessage({
          chatId: finalChatId,
          content: message,
          role: "user",
        }),
      );

      dispatch(
        addNewMessage({
          chatId: finalChatId,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );

      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Message failed"));
    } finally {
      dispatch(setSending(false));
    }
  }

  async function handleGetChats() {
    try {
      dispatch(setFetchingChats(true));
      const data = await getChats();
      const { chats } = data;
      dispatch(
        setChat(
          chats.reduce((acc, chat) => {
            acc[chat._id] = {
              id: chat._id,
              title: chat.title,
              messages: [],
              lastUpdated: chat.updatedAt,
            };

            return acc;
          }, {}),
        ),
      );
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Get chats failed"));
    } finally {
      dispatch(setFetchingChats(false));
    }
  }

  async function handleOpenChat(chatId) {
    try {
      dispatch(setFetchingChats(true));
      const data = await getMessages(chatId);

      const { messages } = data;

      const formatedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));

      dispatch(
        addMessages({
          chatId,
          messages: formatedMessages,
        }),
      );

      dispatch(setCurrentChatId(chatId));
    } catch (error) {
      setError(error.response?.data?.message || "Get chat failed");
    } finally {
      dispatch(setFetchingChats(false));
    }
  }

  async function handleChatDelete(chatId) {
    try {
      dispatch(setDeleting(true));

      await deleteChat(chatId);

      dispatch(deleteChatLocal(chatId));
    } catch (error) {
      setError(error.response?.data?.message || "Delete chat failed");
    } finally {
      dispatch(setDeleting(false));
    }
  }

  function handleNewChat() {
    dispatch(setCurrentChatId(null));
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleChatDelete,
    handleNewChat,
  };
};
