import { useEffect, useState } from "react";
import { useGetMessagesQuery } from "../api/message/queries";
import type { Message, User } from "../shared/types";
import { ChatHeader } from "./ChatHeader";
import { Chats } from "./Chats";
import { MessageInput } from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useSocketStore } from "../store/useSocketStore";
import { queryClient } from "../main";

type ChatContainerProps = {
  user: User;
}
export const ChatContainer = ({ user }: ChatContainerProps) => {
  
  const { 
    data: messagesListResponse,
    isLoading: messagesLoading 
  } = useGetMessagesQuery(user._id);

  const { socket } = useSocketStore();

  const messages: Message[] = messagesListResponse;

  const [isImagePreviewOpen, setImagePreviewOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!socket) return;
    console.log("here");

    socket.on("newMessage", (newMessage) => {
      // We only care about this message if it's from the person we are currently chatting with
      if (newMessage.senderId !== user._id) return;

      // Update the cache for the specific conversation
      queryClient.setQueryData(["messages", user._id], (oldMessages: Message[]) => {
        // If there's no cache yet, create an array with the new message
        if (!oldMessages) return [newMessage];
        
        // Return a new array with the old messages plus the one new message
        return [...oldMessages, newMessage];
      });
    });

    // Cleanup: Remove listener when component unmounts or selectedUser changes
    return () => {
      socket.off("newMessage");
    };

  }, [user._id, socket])

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader user={user}/>
      {messagesLoading ? (
        <MessageSkeleton />
      ) : 
      <div className="flex-1 min-h-0 flex flex-col">
        <Chats messages={messages} user={user} isImagePreviewOpen={isImagePreviewOpen}/>
      </div>
      }
      <MessageInput userId={user._id} setImagePreviewOpen={setImagePreviewOpen}/>
    </div>
  )
}
