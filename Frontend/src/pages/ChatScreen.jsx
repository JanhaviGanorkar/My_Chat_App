import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MessageBubble from "../components/ui/MessageBubble";
import { useFriendsStore } from "../store/FriendStore";

const ChatScreen = () => {
  const location = useLocation();
  const friendName = location.state?.friendName || "Unknown"; // Get friendName from ProfileCard
  const friendId = location.state?.friendId || 3;
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null); // Single value instead of array
  const [message, setMessage] = useState("");
  const socketRef = useRef(null);
  const { friends, loadFriends } = useFriendsStore();

  const token = localStorage.getItem("access"); // Fetch access token

  useEffect(() => {
    if (!token) {
      console.error("No access token found!");
      return;
    }

    // Fetch user ID
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

    // WebSocket Setup
    const ws = new WebSocket(
      `ws://localhost:8000/ws/chat/${encodeURIComponent(friendName)}/?token=${token}`
    );
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket connected");

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        console.error("⚠️ Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = (event) => console.warn("❌ WebSocket closed", event.reason);
    ws.onerror = (e) => console.error("⚠️ WebSocket error:", e);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [friendName, token]); // Connect WebSocket with friend's name

  const sendMessage = async () => {
    if (!userId || !friendId) {
      console.error("❌ User ID or Friend ID is missing!", { userId, friendId });
      return;
    }
  
    const messageData = {
      type: "chat_message",
      message,
      sender: parseInt(userId), // Ensure integer
      receiver: parseInt(friendId),
    };
  
    console.log("📤 Sending message data:", messageData); // ✅ Debugging
  
    try {
      const res = await fetch("http://127.0.0.1:8000/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });
  
      const data = await res.json();
      console.log("📩 Response from backend:", data); // ✅ Debugging
  
      if (!res.ok) {
        console.error("❌ Failed to save message", data);
      }
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  
    setMessage("");
  };
  

  return (
    <div className="p-4 space-y-2 bg-gray-100 h-screen flex flex-col">
      <h2 className="text-lg font-semibold">Chat with {friendName}</h2>

      {/* Messages List */}
      <div className="flex-grow overflow-auto space-y-2">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg.message}
            isSent={msg.sender === userId} // Fixed condition
          />
        ))}
      </div>

      {/* Input Box & Send Button */}
      <div className="flex items-center p-2 bg-white shadow-md rounded-lg">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
