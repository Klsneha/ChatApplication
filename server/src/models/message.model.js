import mongoose, { Types} from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    receivedId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String
    },
    image: {
      type: String
    }
  },
  // This will create createdAt, updatedAt fields. 
  { 
    timestamps: true
  }
);
const Message = mongoose.model("Message", messageSchema);
export default Message;