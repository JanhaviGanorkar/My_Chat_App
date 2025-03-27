import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MessageBubble from "../components/ui/MessageBubble";

const ChatScreen = () => {
  const location = useLocation();
  const friendName = location.state?.friendName || "Unknown";
  const friendId = location.state?.friendId;

  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const socketRef = useRef(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token || !friendId) {
      console.error("No access token or friend ID found!");
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

    // ✅ WebSocket Connection
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${friendId}/?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket connected");

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log("📩 New Message Received:", data);

        // ✅ Fix: Ensure correct message format
        if (data.sender && data.message) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      } catch (error) {
        console.error("⚠️ Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = (event) => console.warn("❌ WebSocket closed:", event.reason);
    ws.onerror = (e) => console.error("⚠️ WebSocket error:", e);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [friendId, token]);

  const sendMessage = async () => {
    if (!socketRef.current || !message.trim() || !userId || !friendId) return;
  
    const messageData = {
      sender: userId,
      receiver: friendId,  // ✅ Include receiver ID
      content: message,  // ✅ Fix field name (should match Django model)
    };
  
    // ✅ Send message through WebSocket
    socketRef.current.send(JSON.stringify(messageData));
  
    // ✅ Save message to backend
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/messages/",
        messageData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("📩 Message Saved:", res.data);
    } catch (error) {
      console.error("❌ Error saving message:", error.response?.data || error);
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
            message={msg.message} // ✅ Fix: Ensure "message" is used correctly
            isSent={msg.sender === userId}
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
