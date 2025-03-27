import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react"; 


const Navbar = ({ isAuthenticated }) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(document.body.classList.contains("dark"));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark", !darkMode);
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md">
          {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-800" />}
        </button>
        <Link to="/" className="text-2xl font-bold hover:text-gray-200">
          My Chat App
        </Link>

        <div className="flex items-center gap-4">
          <button className="lg:hidden text-white text-2xl focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <nav className={`absolute lg:static top-16 left-0 w-full lg:w-auto bg-blue-600 lg:bg-transparent lg:flex lg:items-center transition-all duration-300 ${isMenuOpen ? "block" : "hidden"}`}>
          <ul className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6 p-4 lg:p-0">
            {isAuthenticated ? (
              <>
                <li><Link to="/userprofile" className="hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
                <li><Link to="/friend" className="hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>Friends</Link></li>
                <li><Link to="/friendreq" className="hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>Friend Requests</Link></li>
                <li><button onClick={handleLogout} className="hover:text-gray-200 focus:outline-none">Logout</button></li>
              </>
            ) : (
              <>
                 <li><Link to="/about" className="hover:text-gray-200">About</Link></li>
            <li><Link to="/contact" className="hover:text-gray-200">Contact</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-gray-200">Privacy</Link></li>
                <li><Link to="/login" className="hover:text-gray-200">Login</Link></li>
                <li><Link to="/register" className="hover:text-gray-200">Register</Link></li>
              </>
            )}
          
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
