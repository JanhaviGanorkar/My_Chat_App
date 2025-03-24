import { useEffect } from "react";
import { useFriendsStore } from "../store/FriendStore";
import { useNavigate } from "react-router-dom"; // ✅ React Router for navigation

const FriendList = () => {
  const { friends, loadFriends } = useFriendsStore();
  const navigate = useNavigate(); // ✅ Hook for navigation

  useEffect(() => {
    loadFriends(); // ✅ Fetch friends on mount
  }, []);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-3">Friends List</h2>
      {friends.length === 0 ? (
        <p className="text-gray-500">No friends found</p>
      ) : (
        <ul className="space-y-3">
          {friends.map((friend) => (
            <li
              key={friend.friend__id}
              className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
              onClick={() => navigate("/", { state: { friendId: friend.friend__id } })} // Fix the navigation path
            >
              <img
                src={friend.profilePic || "/default-avatar.png"}
                alt={friend.friend__name}
                className="w-10 h-10 rounded-full border"
              />
              <span className="text-lg font-medium">{friend.friend__name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendList;
