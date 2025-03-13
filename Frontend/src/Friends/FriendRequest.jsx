import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export default function FriendRequest() {
  const [friendRequests, setFriendRequests] = useState([]);
  const token = localStorage.getItem("access");

  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
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
