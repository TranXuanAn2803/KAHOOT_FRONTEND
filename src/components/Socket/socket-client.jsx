import React, { createContext } from "react";
import socketio from "socket.io-client";

export const socket = socketio.connect(process.env.REACT_APP_API_URL);
export const SocketContext = createContext(socket);

export function SocketContextProvider({ children }) {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
