import { useEffect, useMemo, useRef } from "react";
import { useCheckAuthQuery } from "../api/auth/queries";
import type { Message, User } from "../shared/types";
import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";

type MessageProps = {
  messages: Message[];
  user: User;
  isImagePreviewOpen: boolean;
}
export const Chats = ({ messages, user, isImagePreviewOpen }: MessageProps) => {
  const sortedMessages = useMemo(() => 
    [...messages].sort((a,b) =>  Date.parse(a.updatedAt) - Date.parse(b.updatedAt)),
  [messages]);
  
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  const { data: myDetailsResponse } = useCheckAuthQuery();
  const myDetails: User = myDetailsResponse?.data;

  useEffect(() => {
    if (scrollRef.current) {
      // 1. If it's the first time opening, jump instantly
      if (isInitialLoad.current) {
        scrollRef.current.scrollIntoView({ behavior: "auto" });
        isInitialLoad.current = false; // Set to false so next time is smooth
      } else {
        // 2. If it's a new message while the chat is open, scroll smoothly
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [sortedMessages]); 

  // Reset the initial load flag if the user changes (switching between chats)
  useEffect(() => {
    isInitialLoad.current = true;
  }, [user._id]);


  // 2. Setup the Virtualizer
  const rowVirtualizer: Virtualizer<HTMLDivElement, Element> = useVirtualizer({
    count: sortedMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // A rough guess of message height in pixels
    overscan: 5,            // How many messages to render off-screen (prevents flickering)
  });

  // 3. Handle Auto-scroll to bottom on new messages
  useEffect(() => {
    if (sortedMessages.length > 0) {
      rowVirtualizer.scrollToIndex(sortedMessages.length - 1, { align: "end" });
    }
  }, [sortedMessages.length, rowVirtualizer, isImagePreviewOpen]);


  const getleftMessage = (message: Message) => {
    const time = new Date(message.updatedAt).toLocaleTimeString()
    return (
      <div className="chat chat-start">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src={user?.profilePic?.imageUrl ? user?.profilePic?.imageUrl : "/avatar.png"}
            />
          </div>
        </div>
        <div className="chat-header">
          {user.fullName}
          <time className="text-xs opacity-50">{time}</time>
        </div>
        <div className="chat-bubble flex-col">
          
          {message?.image ? 
            <>
              <img
                className="sm:max-w-50 rounded-md mb-2"
                alt="Tailwind CSS chat bubble component"
                src={message?.image ?? "/avatar.png"}
              />
            </> : null
          }
          {message?.text ? 
            <>
              <div>{message.text}</div>
              {/* <div className="chat-footer opacity-50">Delivered</div> */}
            </> : null
          }
        </div>
      </div>
    )
  }

  const getRightMessage = (message: Message) => {
    const time = new Date(message.updatedAt).toLocaleTimeString();
    return (
      <div className="chat chat-end">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              src={myDetails?.profilePic?.imageUrl ? myDetails?.profilePic?.imageUrl : "/avatar.png"}
            />
          </div>
        </div>
        <div className="chat-header">
          {myDetails?.fullName}
          <time className="text-xs opacity-50">{time}</time>
        </div>
        <div className="chat-bubble flex-col">
          
          {message?.image ? 
            <>
              <img
                className="sm:max-w-50 rounded-md mb-2"
                alt="Tailwind CSS chat bubble component"
                src={message?.image ?? "/avatar.png"}
              />
            </> : null
          }
          {message?.text ? 
            <>
              <div>{message.text}</div>
              {/* <div className="chat-footer opacity-50">Delivered</div> */}
            </> : null
          }
        </div>
      </div>
    );

  }

  return (
    <div 
      ref={parentRef} 
      className="flex-1 overflow-y-auto px-4 py-2"
      // style={{ contain: 'strict' }}
    >
      {/* The "Inner" container that has the total height of all messages */}
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Only render the items returned by the virtualizer */}
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const message = sortedMessages[virtualItem.index];
          const isMe = message?.senderId === myDetails?._id;

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={rowVirtualizer.measureElement} // Measures the real height of the message
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {isMe ? getRightMessage(message) : getleftMessage(message)}
            </div>
          );
        })}
      </div>
    </div>
  );

  // return (
  //   <div className="flex-1 overflow-y-auto px-4 py-2">
  //     {sortedMessages.map((message: Message) => {
  //       if (message.senderId === user._id) {
  //         return getleftMessage(message);
  //       } else if (message.senderId === myDetails._id) {
  //         return getRightMessage(message);
  //       }
  //     })}
  //     {/* 4. The invisible anchor at the bottom */}
  //     <div ref={scrollRef} />
  //   </div>
  // )
}
