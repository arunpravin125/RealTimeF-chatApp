import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Message } from "../models/message.model.js";

export const app = express();

export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true, // If authentication is needed
  },
});

export let userSocketMap = {};

// Function to get the socket ID of a user
export const getSocketId = (sender) => userSocketMap[sender];

// Socket.IO Connection Handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log("Updated userSocketMap:", userSocketMap);
  }

  //emit updated list of online users
  io.emit("getOnlineUser", Object.keys(userSocketMap));

  // handle message seen
 socket.on("messageAsSeen",async({conversationId,userId})=>{
  try {
    console.log("messageAsSeen",conversationId,userId)
    await Message.updateMany({conversationId:conversationId,seen:false},{
     $set:{ seen:true}
    })
     io.to(getSocketId(userId)).emit("messageSeened",conversationId)
  } catch (error) {
    console.log("error in messageAsSeen",error)
  }
 })

 // message delete event
 socket.on("messageDelete",({conversationId,userId,messageId})=>{
     console.log("messageDelete",conversationId,userId,messageId)
  io.to(getSocketId(userId)).emit("messageDeleted",{conversationId,messageId})
 })

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    
    // Ensure user exists before deleting
    const disconnectedUser = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );

    if (disconnectedUser) {
      delete userSocketMap[disconnectedUser];
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  });
});
