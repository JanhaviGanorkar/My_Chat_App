import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FriendList from "../Friends/Friends";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom"; // ✅ Ensure navigation works

const UserProfile = () => {
  const navigate = useNavigate(); // ✅ Use navigation hook
  const token = localStorage.getItem("access");
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!token) {
        navigate("/login");
    }
}, [token, navigate]);
  // Fetch user ID when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(response.data.user_id);
      } catch (error) {
        console.error("❌ Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  // Fetch user profile when userId is available
  useEffect(() => {
    if (!userId) return
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/user-profile/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { t: new Date().getTime() }, // ✅ Forces fresh data
        });

        console.log("✅ Profile Data Fetched:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch user profile:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // 🔹 Handle empty user data
  if (!user) {
    return <div className="text-center text-red-500">User not found!</div>;
  }

  return (
    <motion.div
      className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-3xl border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-white shadow-lg rounded-2xl">
        <CardContent className="p-6 flex flex-col items-center">
          {/* Profile Image */}
          <motion.div whileHover={{ scale: 1.1 }} className="relative">
            <Avatar className="w-24 h-24 border-4 border-gray-300 shadow-md">
              <AvatarImage
                src={`http://127.0.0.1:8000${user.profile_image}?t=${new Date().getTime()}`}
                alt="Profile"
              />


              <AvatarFallback>
                {user.user?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

          </motion.div>

          {/* Name & Email */}
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.user}</h2>
          <p className="text-gray-500">{user.email}</p>

          {/* Edit Profile Button */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              onClick={() => navigate("/editprofile", { state: { userId } })}
              className="mt-4 bg-blue-500 text-white hover:bg-blue-600 transition-all"
            >
              Edit Profile
            </Button>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            className="mt-6 w-full p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-700">Bio</h3>
            <p className="text-gray-600">{user.bio || "No bio available."}</p>

          </motion.div>

          {/* Friends List */}
          <div className="mt-6 w-full">
            <FriendList />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProfile;
