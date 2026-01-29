import User from "../models/users.models.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../lib/socket.js";
import { gemini, GEMINI_EMBEDDING_MODEL } from "../lib/llm/gemini.js";

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const listUsers = await User.find().select("-password");
    const users = listUsers.filter((user) => user.id !== loggedInUserId);
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
    const { id: userToChatId } = req.params; // other user
    const myId = req.user.id; // senderId

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
    const { text, image } = req.body;
    const { id: receivedId } = req.params;
    const senderId = req.user.id;


    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl =  uploadResponse.secure_url;
    }

    // Generate embedding
    const embeddingResponse = await gemini.models.embedContent({
      model: GEMINI_EMBEDDING_MODEL,
      contents: text,
      config: { outputDimensionality: 10 }
    });

    const embedding = embeddingResponse.embeddings?.[0]?.values;

    const newMessage = await Message.create({ senderId, receivedId, text, image: imageUrl, embedding});
    if (newMessage) {
      const receiverSocketId = userSocketMap[receivedId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      res.status(201).json({ newMessage, message: "New message has been sent" });
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
