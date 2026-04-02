import { io } from "socket.io-client";

let socket = null;

export const initializeSocketConnection = (userId) => {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true,
      auth: { userId },
    });
  }
  return socket;
};

export const getSocket = () => socket;