import { useEffect, useState } from "react";
import { useFriendsStore } from "../store/FriendStore";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Spinner from "../components/Spinner";
import { FaUserFriends } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const FriendList = () => {
  const { friends, loadFriends } = useFriendsStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      await loadFriends();
      setLoading(false);
    };
    fetchFriends();
  }, []);

  const token = localStorage.getItem("access");
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

  return (
    <div className="mt-6 pt-10">
      <div className="flex-grow w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          Your Friends
        </h2>

        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 mt-6">
            <FaUserFriends className="text-6xl mb-2 text-gray-400 dark:text-gray-500" />
            <p>No friends found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {friends.map((friend) => (
              <li
                key={friend.friend__id}
                className="flex items-center gap-4 p-3 rounded-lg transition hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => navigate(`/friendprofile/${friend.friend__id}`)}
              >
                <Avatar className="w-16 h-16 border-2 border-gray-300">
                  <AvatarImage
                    src={`http://127.0.0.1:8000${friend.profilePic}?t=${new Date().getTime()}`}
                    alt={friend.friend__name}
                  />
                  <AvatarFallback>
                    {friend.friend__name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-lg font-medium text-gray-800 dark:text-white">
                    {friend.friend__name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Click to view profile
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* 🔹 Search User Section (Always Visible) */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Find New Friends</h3>
          <div className="flex items-center space-x-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email"
              className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
            />
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition"
            >
              Search
            </Button>
          </div>

          {searchResults.length > 0 && (
            <ul className="space-y-3 mt-3">
              {searchResults.map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between items-center bg-gray-100 p-3 rounded-lg shadow-sm hover:bg-gray-200 transition"
                >
                  <div>
                    <p className="text-black font-medium">{user.name}</p>
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
