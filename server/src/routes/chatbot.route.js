import express from "express";
import { chatBotController } from "../controller/chatbot.controller.js";
// import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/chatBot", chatBotController.getQueryResponse);
export default router;

