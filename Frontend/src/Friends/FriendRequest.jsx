import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export default function FriendRequest() {
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [receiver_id, setReceiver_id] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const token = localStorage.getItem("access");

  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
    
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/friends/search/?query=${searchQuery}`, { headers });
      setSearchResults(response.data.users);
     
      console.log(response.data.users)
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const handleSendFriendRequest = async (receiver_id) => {
    // const token = localStorage.getItem("access");  // Check token
    console.log("Using token:", token);  // Debugging

    try {
      console.log(receiver_id)
        const response = await axios.post(
            `http://127.0.0.1:8000/friends/send/${receiver_id}/`, 
            {}, 
            { headers } );
        console.log("Friend request sent successfully", response.data);
        alert("Friend request sent successfully");
    } catch (error) {
        console.error("Error sending friend request:", error.response?.data || error.message);
        alert("Failed to send friend request");
    }
};


  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/friends/requests/",
          { headers }
        );
        setFriendRequests(response.data.friend_requests || []);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchFriendRequests();
  }, []);
  const queryClient = useQueryClient(); // ✅ Ensure queryClient is initialized

  const acceptMutation = useMutation({
    mutationFn: async (friendId) => {
      return axios.post(
        `http://127.0.0.1:8000/friends/accept/${friendId}/`,
        {},  // Empty request body
        { headers }  // ✅ Correct placement
      );
    },
    onSuccess: (_, friendId) => {
      // ✅ Remove the accepted friend request from state
      setFriendRequests((prevRequests) =>
        prevRequests.filter((friend) => friend.id !== friendId)
      );
    },
  });
  
  


  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <Card className="shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle>
          Add Friends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name or email"
        />
        <Button onClick={handleSearch}>Search</Button>
        {searchResults.length > 0 && (
          <ul className="space-y-3 mt-4">
            {searchResults.map((user) => (
              
              <li key={user.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                <div>
                  <p className="text-gray-800 font-medium">{user.name}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
                <Button
                 
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendFriendRequest(user.id)}
                >
                  Add Friend
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      </Card>
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Friend Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {friendRequests.length > 0 ? (
            <ul className="space-y-3">
              {friendRequests.map((friend, index) => (
                <motion.li
                  key={friend.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="text-gray-800 font-medium">
                      {friend.sender__name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {friend.sender__email}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => acceptMutation.mutate(friend.id)}
                    disabled={acceptMutation.isLoading}
                  >
                    {acceptMutation.isLoading ? "Accepting..." : "Accept"}
                  </Button>
                </motion.li>
              ))}
            </ul>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-gray-500 text-center"
            >
              No friend requests.
            </motion.p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
