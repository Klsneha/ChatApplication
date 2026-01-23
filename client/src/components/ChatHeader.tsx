import type { User } from "../shared/types";

type ChatHeaderProps = {
  user: User;
}
export const ChatHeader = ({ user }: ChatHeaderProps) => {
  return (
    <div className="flex flex-row p-3 gap-3 bg-base-300">
      <img 
        src={user?.profilePic?.imageUrl ? user?.profilePic?.imageUrl : "/avatar.png"}
        className="size-12 rounded-full object-cover"
      />
      <div className='flex-1'>
        <p>{user.fullName}</p>
        <p className='text-sm'>Offline</p>
      </div>
    </div>
  );
}
