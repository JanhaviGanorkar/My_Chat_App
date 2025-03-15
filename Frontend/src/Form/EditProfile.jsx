import axios from "axios";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useLocation } from "react-router-dom";

export default function EditProfile() {


const location = useLocation();
const userId = location.state?.userId;  // ✅ Retrieve userId
console.log("Received userId in EditProfile:", userId);

    const token = localStorage.getItem("access");
    const headers = { Authorization: token ? `Bearer ${token}` : "" };
    const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000//user_profile/${userId}/`, {headers});
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/user_profile/${userId}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-3xl border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <Input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled // Email should not be editable
        />

        <label htmlFor="bio">Bio</label>
        <Input
          type="text"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
        />

        <Button type="submit" className="mt-4 w-full">
          Save
        </Button>
      </form>
    </motion.div>
  );
}
