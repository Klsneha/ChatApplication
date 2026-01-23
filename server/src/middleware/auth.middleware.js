import jwt from "jsonwebtoken";
import User from "../models/users.models.js";

export const protectedRoute = async (req, res, next) => {
  try{
    const cookies = req.cookies;
    if (!cookies.jwt) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return;
    }
    const decoded = jwt.verify(cookies.jwt, process.env.JWT_SECRET);
    if (!decoded) {
      res.status(401).json({ message: "Unauthorized - token is invalid" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log("Error while verifying token", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
