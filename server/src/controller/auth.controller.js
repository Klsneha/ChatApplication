import User from "../models/users.models.js";
import asyncHandler from "express-async-handler";
import { generateToken } from "../lib/utils.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";
const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "FullName, Email and password are required" });
      return;
    }
  
    if (password.length < 6) {
      res.status(400).json({ message: "Password must be atleast 6 characters" });
      return;
    }

    const existingUser = await User.findOne({ email }).lean().exec();
    if (existingUser) {
      res.status(404).json({ message: "User with emailId is already registered please use different Email" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ 
      fullName,
      email,
      password: hashedPassword
    });

    if (newUser) {
      generateToken(newUser._id, res);
      res.status(201).json({ 
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        message: `User ${fullName} has been created` });
      return;
    } else {
      res.status(400).json({ message: "Invalid user data" });
      return;
    }
    
  } catch (err) {
    console.log("Error in Sign up controller", err);
    res.status(505).json({ message: "Internal Server Error" });
    return;
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const userDetails = await User.findOne({ email }).lean().exec();
    console.log("** userDetails", userDetails);
    if (!userDetails) {
      res.status(400).json({ message: "Unauthorized: Invalid credentials" });
      return;
    } 

    const matchedPwd = await bcrypt.compare(password, userDetails.password);
    if (!matchedPwd) {
      res.status(400).json({ message:  "Unauthorized: Invalid credentials" });
      return;
    } else {
      generateToken(userDetails._id, res);
      res.status(200).json({ 
        _id: userDetails._id,
        email: userDetails.email,
        password: userDetails.password,
        profilePic: userDetails.profilePic,
        message: "Successfully logged in"
      });
      return;
    }

  } catch (err) {
    console.log("Error in login controller", err);
    res.status(505).json({ message: "Internal Server Error" });
    return;
  }

};

const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "none", // required for cross-site cookies
      maxAge: 0 // immediately expire the cookie
    });
    res.status(200).json({ message: "logged out!" });

  } catch (err) {
    console.log("Error in logout controller", err);
    res.status(505).json({ message: "Internal Server Error" });
    return;
  }
};

const updateProfile = async (req, res) => {
  try {
    const profilePic = req.body;
    const userId = req.use._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Picture is not uploaded" });
    }

    const uploadResponse = await cloudinary.uploader.upload("my_image.jpg");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        profilePic: uploadResponse.secure_url
      },
      { 
        new:true
      });
    res.status(200).json({ message: updatedUser});
    return;
  } catch (err) {
    console.log("Error while uploading image controller", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);

  } catch (err) {
    console.log("Error in Check Auth controller", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const authController = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth
};