import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { useAuthStore } from "../store/authStore";
import Spinner from "../components/Spinner";

const ProfileCard = () => {
    const { friendId } = useParams(); // Get friendId from URL
    const [friendData, setFriendData] = useState(null);
    const { accessToken } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
        }
    }, [accessToken, navigate]);

    const headers = { Authorization: accessToken ? `Bearer ${accessToken}` : "" };

    useEffect(() => {
        const fetchFriendData = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/friend_profile/${friendId}/`, { headers });
                setFriendData(res.data);
            } catch (error) {
                console.error("Error fetching friend data:", error);
            }
        };
    
        if (friendId) fetchFriendData();
    }, [friendId, accessToken]);

    const handleAddFriend = async () => {
        try {
            await axios.post(`http://127.0.0.1:8000/friends/send/${friendId}/`, {}, { headers });
            alert("Friend Request Sent successfully");
        } catch (error) {
            console.error("Error sending friend request:", error);
            alert("Failed to send friend request");
        }
    };

    if (!friendData) return <Spinner />; // Show spinner while loading

    const { user_profile } = friendData;

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
                        {/* Pass friendName to ChatScreen */}
                        <Button 
                            onClick={() => navigate(`/chatscreen`, { state: { friendName: user_profile.name, friendId: user_profile.id } })}
                            className="bg-blue-500 text-white hover:bg-blue-600"
                        >
                            Message
                        </Button>
                        <Button 
                            variant="outline" 
                            className="border-gray-400 text-gray-700 hover:border-gray-600"
                            onClick={handleAddFriend}
                        >
                            Add Friend
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProfileCard;
