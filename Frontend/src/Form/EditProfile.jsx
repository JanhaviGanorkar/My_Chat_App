import axios from "axios";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useLocation } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";

export default function EditProfile() {
  const location = useLocation();
  const userId = location.state?.userId;
  // console.log("Received userId in EditProfile:", userId);

  const token = localStorage.getItem("access");
  const headers = { Authorization: token ? `Bearer ${token}` : "" };

  const [formData, setFormData] = useState({
    user: "",
    email: "",
    bio: "",
    profile_image: "", // ✅ Ensure correct key name
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!userId) return; // Prevent unnecessary calls if userId is not set

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/user-profile/${userId}/`, { headers });
        console.log("Fetched User Data:", response.data);

        setFormData((prev) => ({
          ...prev,
          user: response.data.user ?? "",
          email: response.data.email ?? "",
          bio: response.data.bio ?? "",
          profile_image: response.data.profile_image ?? "", // ✅ Prevent unnecessary updates
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (!e.target.files[0]) return; // ✅ Prevent unnecessary state updates
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    updatedFormData.append("user", formData.user);
    updatedFormData.append("bio", formData.bio);

    if (selectedFile) {
      updatedFormData.append("profile_image", selectedFile); // ✅ Ensure correct key
    }

    try {
      const response = await axios.patch(`http://127.0.0.1:8000/user-profile/${userId}/`, updatedFormData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Profile updated:", response.data);
      setFormData({
        ...formData,
        profile_image: response.data.profile_image, // ✅ Update image after upload
      });
    } catch (error) {
      console.error("Update failed:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-3xl border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex flex-col items-center">
          {/* Show Avatar/Profile Picture */}
          <Avatar className="w-24 h-24 border-4 border-gray-300">
            <img
              src={
                formData.profile_image
                  ? `http://127.0.0.1:8000${formData.profile_image}`
                  : "/default-avatar.png"
              }
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </Avatar>

          {/* Upload Profile Picture */}
          <input type="file" accept="image/*" onChange={handleFileChange} className="mt-4" />
        </div>

        <label htmlFor="user">Username</label>
        <Input type="text" name="user" value={formData.user} onChange={handleChange} />

        <label htmlFor="email">Email</label>
        <Input type="email" name="email" value={formData.email} disabled />

        <label htmlFor="bio">Bio</label>
        <Input type="text" name="bio" value={formData.bio} onChange={handleChange} />

        <Button type="submit" className="mt-4 w-full">
          Save
        </Button>
      </form>
    </motion.div>
  );
}