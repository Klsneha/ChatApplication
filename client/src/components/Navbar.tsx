import { LogOut, MessageSquare, Settings, User } from "lucide-react"
import { useCheckAuthQuery, useLogoutMutation } from "../api/auth/queries";
import { notifyError } from "../shared/common";
import { Link } from "react-router-dom";

export const Navbar = () => {

  const {
    mutate: logout,
    isError,
    error
  } = useLogoutMutation();

  const onLogout = () => {
    logout();
  }

  if (isError) {
    notifyError(error, isError);
  }

  const { data: verifyAuth } = useCheckAuthQuery();

  return (
    <div className="flex flex-row h-10 items-center justify-center border-2  p-2">
      <Link className="flex flex-row gap-1" to="/">
        <div
          className="size-6 rounded-bl-md bg-primary/10 flex items-center justify-center 
          group-hover:bg-primary/20 transition-colors"
        >
          <MessageSquare className="size-4 text-primary" /> 
        </div>
        <div>Chatty</div>
      </Link>
      <div className="flex flex-row flex-1 justify-end gap-6">
        <div className="flex items-center z-10 gap-1">
          <Settings className="size-5 text-base-content/40"/>
          <Link to="/settings">Settings</Link>
        </div>

        <div className="flex items-center z-10 gap-1">
          <User className="size-5 text-base-content/40"/>
          <Link to={"/profile"}>Profile</Link>
        </div>

        {verifyAuth ? 
        <div className="flex items-center z-10 gap-1">
          <LogOut className="size-5 text-base-content/40"/>
          <button onClick={onLogout} className="cursor-pointer">Logout</button>
        </div> : null}
      </div>
    </div>
  )
}
