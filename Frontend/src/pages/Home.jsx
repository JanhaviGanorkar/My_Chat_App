import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div >
      {/* Hero Section */}
      <div
        className={`flex flex-col items-center justify-center min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-100 to-blue-300"}`}
      >
        {/* Theme Toggle Button */}
        {/* <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow-md"
        >
          {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-800" />}
        </button> */}

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold mb-4">
            Welcome to <span className="text-blue-600 dark:text-blue-400">My Chat App</span>
          </h1>
          <p className="text-lg mb-6">
            Connect with your friends and enjoy seamless communication with real-time messaging, profile customization, and more.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <motion.button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                className="px-6 py-3 bg-gray-100 text-blue-600 rounded-lg shadow-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Login
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Real-Time Messaging</h3>
          <p className="text-gray-700 dark:text-gray-300">Chat with your friends instantly with our real-time messaging feature.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Customizable Profiles</h3>
          <p className="text-gray-700 dark:text-gray-300">Personalize your profile with pictures, bios, and more.</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Secure and Private</h3>
          <p className="text-gray-700 dark:text-gray-300">Your data is safe with end-to-end encryption and secure storage.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
