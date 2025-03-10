import React from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function Home() {
  const fetchFriends = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/friends/list/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`, // Add auth if needed
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-lg rounded-2xl p-6 text-center"
      >
        <h1 className="text-2xl font-bold text-green-600">Login Successful ✅</h1>
      </motion.div>
    </div>
  );
}
