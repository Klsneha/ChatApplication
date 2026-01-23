import { useState } from "react";
import { NoChatContainer } from "../components/NoChatContainer";
import { ChatContainer } from "../components/ChatContainer";
import { UsersList } from "../components/UsersList";
import type { User } from "../shared/types";
import { Users } from "lucide-react";


export const HomePage = () => {

  const [selectedUser, setSelectedUser] = useState<User>();
  const [showOnlineUsers, setShowOnlineUsers] = useState<boolean>(false);
  return (
    <div className="flex-1 min-h-0 bg-base-200 flex flex-col">
      <div className="flex-1 min-h-0 flex flex-row px-4 py-4"> 
        <div className="flex flex-col">
          <div>
            <div className="flex flex-row gap-2">
              <Users className="size-5 text-base-content/40" />
              <p className="pt-0.5 text-xs justify-center items-center font-semibold">Contacts</p>
            </div>
            <div className="py-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox size-5"
                  checked={showOnlineUsers}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowOnlineUsers(e.target.checked)}
                />
                <span className="text-xs font-semibold"> Show Online only (0 online)</span>

              </label>
            </div>
          </div>
          {/* This wrapper is now exactly as tall as the remaining screen space */}
          <UsersList 
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
            showOnlineUsers={showOnlineUsers}
          />
        </div>
        {!selectedUser ? <NoChatContainer /> : <ChatContainer user={selectedUser}/>}
      </div>
    </div>
  )
}
