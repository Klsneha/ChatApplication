import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import chatBotRoutes from "./routes/chatbot.route.js";
import { connectDB } from "./lib/db.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { logEvents } from "./middleware/logger.js";
import { app, server } from "./lib/socket.js";

dotenv.config(); // so that we can access env variables
const PORT = process.env.PORT || 3500
connectDB();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/chat", chatBotRoutes);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => console.log(`🚀 Server is running at http://localhost:${PORT}`))
});

mongoose.connection.on("error", err => {
  console.log("Database connection on listener", err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErrLog.log");
});