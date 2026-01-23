import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { HomePage } from "./pages/HomePage";
// import { useAuthStore } from "./store/useAuthStore";
import { useCheckAuthQuery } from "./api/auth/queries";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useSocketStore } from "./store/useSocketStore";
import type { User } from "./shared/types";

const App = () => {

  const { data: verifyAuth, isLoading: isAuthVerifyLoading } = useCheckAuthQuery();
  const { connectSocket, disconnectSocket, onlineUsers } = useSocketStore();

  useEffect(() => {
    const myDetails: User = verifyAuth?.data;
    if (myDetails?._id) {
      connectSocket(myDetails);
    } else if (!isAuthVerifyLoading && !myDetails?._id) {
      disconnectSocket();
    }
  }, [verifyAuth, isAuthVerifyLoading, connectSocket, disconnectSocket]);

  console.log("** onlineUsers", onlineUsers);

  if (isAuthVerifyLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    );
  }

  const navigateToLogin = () => {
    return <Navigate to="/login" />
  }; 

  const navigateToHome = () => {
    return <Navigate to="/" />
  }; 

  return (
    <>
      <div className="h-screen w-full overflow-hidden flex flex-col">
        <Navbar/>
        <div className="flex-1 min-h-0 flex flex-col">
          <Routes>
            <Route path="/" element={!verifyAuth ? navigateToLogin() : <HomePage/>} />
            <Route path="/signup" element={!verifyAuth ? <SignUpPage/> : navigateToHome()} />
            <Route path="/login" element={!verifyAuth ? <LoginPage/> : navigateToHome()} />
            <Route path="/settings" element={<SettingsPage/>} />
            <Route path="/profile" element={!verifyAuth ? navigateToLogin() : <ProfilePage/>} />
          </Routes>
        </div>
        <Toaster/>
      </div>
      
    </>
  )
}

export default App;
