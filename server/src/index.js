import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3500
connectDB();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`🚀 Server is running at http://localhost:${PORT}`))
});

mongoose.connection.on("error", err => {
  console.log("Database connection on listener", err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,"mongoErrLog.log");
});