import React, { createContext } from "react";
import socketio from "socket.io-client";
import { io } from "socket.io-client";
import { ApiConfig as _ParamConfig } from "../../actions/constants";

export const socket = socketio.connect(process.env.REACT_APP_API_URL);
// export const socket = io(_ParamConfig.socketUrl, { reconnectionDelayMax: 10000 });
export const SocketContext = createContext(socket);

export function SocketContextProvider({ children }) {
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
