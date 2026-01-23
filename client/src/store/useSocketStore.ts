import { create } from "zustand";
import type { User } from "../shared/types";
import { Socket, io } from "socket.io-client";


type SocketState = {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: (myDetails: User) => void;
  disconnectSocket: () => void;
}

const SERVER_URL = "http://localhost:5001";

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connectSocket: (myDetails: User) => {
    if (!myDetails || get().socket?.connected) return;

    const socket = io(SERVER_URL, {
      query: { userId: myDetails._id },
    });

    socket.connect();
    socket.on("getOnlineUsers", (onlineUsers: string[]) => {
      set({ onlineUsers });
    });
    set({ socket });
   
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      socket.on("getOnlineUsers", (onlineUsers: string[]) => {
        set({ onlineUsers });
      });
      set({ socket: null });
    }
  },
  onlineUsers: []
}));