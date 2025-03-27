import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Spinner from "../components/Spinner";
import { FaUserFriends } from "react-icons/fa";


export default function FriendRequest() {
  const navigate = useNavigate();
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/friends/search/?query=${searchQuery}`,
        { headers }
      );
      setSearchResults(response.data.users);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleSendFriendRequest = async (receiver_id) => {
    try {
      await axios.post(`http://127.0.0.1:8000/friends/send/${receiver_id}/`, {}, { headers });
      alert("Friend request sent successfully");
    } catch (error) {
      alert("Failed to send friend request");
    }
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/friends/requests/", { headers });
        setFriendRequests(response.data.friend_requests || []);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };
    fetchFriendRequests();
  }, []);

  const queryClient = useQueryClient();
  const acceptMutation = useMutation({
    mutationFn: async (friendId) =>
      axios.post(`http://127.0.0.1:8000/friends/accept/${friendId}/`, {}, { headers }),
    onSuccess: (_, friendId) => {
      setFriendRequests((prevRequests) =>
        prevRequests.filter((friend) => friend.id !== friendId)
      );
    },
  });

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 space-y-6">

      {/* Search Card */}
      <Card className="shadow-xl border border-gray-300 rounded-lg bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">Add Friends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email"
              className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
  focus:border-blue-500 dark:focus:border-blue-400 focus:ring focus:ring-blue-200 dark:focus:ring-blue-500 rounded-lg"
            />

            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-md  transition"
            >
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <ul className="space-y-3 mt-2">
              {searchResults.map((user) => (
                <motion.li
                  key={user.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm hover:bg-gray-200 transition"
                >
                  <div>
                    <p className=" text-black font-medium">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 
  hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white hover:text-white transition"
                    onClick={() => handleSendFriendRequest(user.id)}
                  >
                    Add friend
                  </Button>
                </motion.li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Friend Requests */}
      <Card className="shadow-xl border border-gray-300 rounded-lg bg-white">
  <CardHeader className="pb-2">
    <CardTitle className="text-xl font-semibold text-gray-800">
      Friend Requests
    </CardTitle>
  </CardHeader>
  <CardContent>
    {friendRequests.length === 0 ? (
      <div className="flex flex-col items-center text-gray-500 py-6">
        <FaUserFriends className="text-4xl mb-2" />
        <p>No friend requests</p>
      </div>
    ) : (
      <ul className="space-y-3">
        {friendRequests.map((friend, index) => (
          <motion.li
            key={friend.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm hover:bg-gray-200 transition"
          >
            <div>
              <p className="text-gray-800 font-medium">{friend.sender__name}</p>
              <p className="text-gray-500 text-sm">{friend.sender__email}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => acceptMutation.mutate(friend.id)}
              disabled={acceptMutation.isLoading}
              className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition"
            >
              {acceptMutation.isLoading ? "Accepting..." : "Accept"}
            </Button>
          </motion.li>
        ))}
      </ul>
    )}
  </CardContent>
</Card>

    </div>
  );
}
