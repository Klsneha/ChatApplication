import express from "express";
import { authController } from "../controller/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.put("/updateProfile", protectedRoute, authController.updateProfile);

router.get("/check", protectedRoute, authController.checkAuth);

export default router;