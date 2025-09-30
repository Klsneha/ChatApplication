import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { messageController } from "../controller/message.controller.js";

const router = express.Router();

router.get("/users", protectedRoute, messageController.getUsersForSidebar);
router.get("/:id", protectedRoute, messageController.getMessages);
router.post("/send/:id", protectedRoute, messageController.sendMessage);

export default router;