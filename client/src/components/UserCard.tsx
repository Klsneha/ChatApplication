import type { User } from '../shared/types'

type UserCardProps = {
  user: User;
  selected: boolean;
  isOnline: boolean;
}
export const UserCard = ({ user, selected, isOnline } : UserCardProps) => {
  return (
    <div className={`hover:bg-zinc-200 flex p-3 px-3 cursor-pointer rounded-xl
    ${selected ? "bg-zinc-200" : ""}`}>
      <div className='relative'>
        <img 
          src={user?.profilePic?.imageUrl ? user?.profilePic?.imageUrl : "/avatar.png"}
          className="size-12 rounded-full object-cover"
        />
        {isOnline && (
          <span className="absolute bottom-0 right-0 size-3.5 bg-green-500 border-2 border-base-100 rounded-full" />
        )}
      </div>
      
      <div className='ml-2'>
        <p>{user.fullName}</p>
        <p className='text-sm'>{isOnline ? "Online" : "Offline"}</p>
      </div>
    </div>
  );
}
