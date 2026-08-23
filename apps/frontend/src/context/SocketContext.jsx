import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      // In production, use the actual backend URL
      const socketInstance = io(import.meta.env.VITE_API_URL?.replace('/api/v1', '') || "http://localhost:5000", {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
      });

      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        console.log("Connected to socket server");
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      socketInstance.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      return () => {
        socketInstance.disconnect();
      };
    } else if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
