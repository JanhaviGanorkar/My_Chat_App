import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Register from "../src/auth/Register";
import Login from "../src/auth/Login";
import Home from "./pages/Home";
import { useAuthStore } from "./store/authStore";
import Logout from "../src/auth/Logout";
import ChatScreen from "./pages/Msg";
import UserProfile from "./pages/UserProfile";
import FriendList from "./Friends/Friends";
import FriendRequest from "./Friends/FriendRequest";
import EditProfile from "../src/Form/EditProfile";
import Navbar from "../src/Navbar/Navbar";
import Footer from "./components/Footer";
import ProfileCard from "./pages/ProfileCard";
import PrivacyPolicy from "../src/pages/PrivacyPolicy";
import About from "../src/pages/About";
import Contact from "../src/pages/Contact";

function PrivateRoute({ element }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  return accessToken ? element : <Navigate to="/login" replace />;
}

function Layout() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return (
    <>
      <Navbar isAuthenticated={!!accessToken} />
      <div className="p-4">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/chatscreen" element={<PrivateRoute element={<ChatScreen />} />} />
          <Route path="/userprofile" element={<PrivateRoute element={<UserProfile />} />} />
          <Route path="/friend" element={<PrivateRoute element={<FriendList />} />} />
          <Route path="/editprofile" element={<PrivateRoute element={<EditProfile />} />} />
          <Route path="/friendreq" element={<PrivateRoute element={<FriendRequest />} />} />
          <Route path="/friendprofile/:friendId" element={<PrivateRoute element={<ProfileCard />} />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
