import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "../src/auth/Register";
import Login from "../src/auth/Login";
import Home from "./pages/Home";
import { useAuthStore } from "./store/authStore"; // Zustand Store
import Logout from "../src/auth/Logout"

// Protected Route Component
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
      </Routes>
    </Router>
  );
}

export default App;
