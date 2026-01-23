import { Loader2 } from "lucide-react";
import { useGetUsersQuery } from "../api/message/queries";
import type { User } from "../shared/types";
import { UserCard } from "./UserCard";
import { useSocketStore } from "../store/useSocketStore";

interface UserListProps {
  setSelectedUser: (user: User) => void;
  selectedUser: User | undefined;
  showOnlineUsers: boolean;
} 
export const UsersList = ({ setSelectedUser, selectedUser, showOnlineUsers } : UserListProps) => {

  const { 
    data: usersListResponse,
    isLoading: usersLoading
  } = useGetUsersQuery();

    const { onlineUsers } = useSocketStore();

  let usersList: User[] = usersListResponse;

  if (showOnlineUsers) {
    usersList = usersList.filter((user) => onlineUsers.includes(user._id));
  }

  return (
    <>
      {usersLoading ? 
        <>
          <Loader2 className="size-5 animate-spin" />
          Loading... 
        </>
      :
        <div className="overflow-y-auto bg-base-100">
          {usersList?.map((user: User) => (
            <div 
              className="border-b border-zinc-200"
              key={user._id}
              onClick={() => setSelectedUser(user)}
            >
              <UserCard user={user} selected={user._id === selectedUser?._id} isOnline={onlineUsers.includes(user._id)}/>
            </div>
          ))}
        </div>
      
      }
    </>
  );
}
