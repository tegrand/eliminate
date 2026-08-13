import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import authConfig from "./auth.config.js";

let io;

export const setupSocket = (server, app) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Adjust this in production to match your frontend URL
      methods: ["GET", "POST"]
    }
  });

  // Attach io to the express app so it can be used in controllers
  app.set("io", io);

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, authConfig.accessSecret);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected to socket: ${socket.user.userId}`);
    
    // Join a room specific to this user to allow targeted events
    socket.join(socket.user.userId);

    socket.on("disconnect", () => {
      console.log(`🔌 User disconnected from socket: ${socket.user.userId}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
