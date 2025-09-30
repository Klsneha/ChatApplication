import User from "../models/users.models.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

const getUsersForSidebar = async (req, res) => {
  try {
    const myUserId = req.user.id;
    const listUsers = await User.find().select("-password");
    const users = listUsers.filter((user) => user.id !== myUserId);
    if (users) {
      return res.status(200).json(users);
    } else {
      return res.status().json({ message: "No Users found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Interal Server Error" });
  }
  
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        {senderId: myId, receivedId:userToChatId},
        {senderId: userToChatId, receivedId: myId}
      ]
    });
    res.status(200).json(messages);
    return;
  } catch (err) {
    console.log("Error in getMessages", err);
    res.status(500).json({ error: "Internal Server error" });
  }
}

const sendMessage = async (req, res) => {
  try {
    console.log("** here");
    const { text, image } = req.body;
    const { id: receivedId } = req.params;
    const senderId = req.user.id;

    console.log("senderId", senderId);

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload("image");
      imageUrl =  uploadResponse.secure_url;
    }

    const message = await Message.create({ senderId, receivedId, text, image: imageUrl});
    console.log("** message", message);
    if (!!message) {
      res.status(201).json({ message: "New message has been sent" });
      return;
    } else {
      res.status(400).json({ message: "Issue while sending message" });
    }
  } catch (err) {
    console.log("Error in sendMessage", err);
    res.status(500).json({ error: "Internal Server error" });
  }
}

export const messageController = {
  getUsersForSidebar,
  getMessages,
  sendMessage
};
