import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "../src/auth/Register";
import Login from "../src/auth/Login";
import Home from "./pages/Home";
import { useAuthStore } from "./store/authStore"; // Zustand Store
import Logout from "../src/auth/Logout"
import ChatScreen  from "./pages/Msg";
import UserProfile from "./pages/UserProfile";
import FriendList from "./Friends/Friends";
import FriendRequest from "./Friends/FriendRequest";
import EditProfile from "../src/Form/EditProfile"
import Chat from "./Friends/Chat";

function PrivateRoute({ element }) {
  const accessToken = useAuthStore((state) => state.accessToken); // Check if user is logged in

  return accessToken ? element : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/chatscreen" element={<ChatScreen />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/friend" element={<FriendList />} />
        <Route path="/editprofile" element={<EditProfile/>} />
        <Route path="/friendreq" element={<FriendRequest />} />
        <Route path="/Chat" element={<Chat roomName="general"/>} />
        
      </Routes>
    </Router>
  );
}

export default App;
