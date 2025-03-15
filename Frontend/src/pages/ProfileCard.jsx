import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useFriendsStore } from "../store/FriendStore";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ friendId }) => {
  const { friends, loadFriends } = useFriendsStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadFriends();
  }, []);
  const [friendData, setFriendData] = useState(null);
  const token = localStorage.getItem("access");
  const headers = { Authorization: token ? `Bearer ${token}` : "" };

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        console.log(`Fetching friend data for ID: ${friendId}`);
        const res = await axios.get(`http://127.0.0.1:8000/friend_profile/${friendId}/`, { headers });
        console.log("API Response:", res.data);
        setFriendData(res.data);
      } catch (error) {
        console.error("Error fetching friend data:", error);
      }
    };

    if (friendId) fetchFriendData();
  }, [friendId]);

  if (!friendData) return <p className="text-center mt-4">Loading...</p>;

  const { user_profile, friend_request_sent, friend_request_received } = friendData;

  return (
    <motion.div className="flex justify-center items-center min-h-screen">
      <Card className="w-96 p-6 shadow-2xl rounded-3xl">
        <CardContent className="flex flex-col items-center">
          <Avatar className="w-24 h-24 border-4 border-gray-300">
            <AvatarImage
              src={`http://127.0.0.1:8000${user_profile.profilePic}?t=${new Date().getTime()}`}
              alt="Profile"
            />
            <AvatarFallback>
              {user_profile.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="mt-4 text-2xl font-bold">{user_profile.name}</h2>
          <p className="text-gray-500">{user_profile.email}</p>
          <div className="mt-6 flex gap-4">
            <Button className="bg-blue-500 text-white hover:bg-blue-600">Message</Button>
            <Button variant="outline" className="border-gray-400 text-gray-700 hover:border-gray-600">Add Friend</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;