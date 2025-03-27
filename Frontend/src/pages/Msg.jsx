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
  const chatContainerRef = useRef(null); // Ref for scrolling
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token || !friendId) {
      console.error("No access token or friend ID found!");
      return;
    }

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
    fetchMessages();

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${friendId}/?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket connected");

    ws.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          console.log("📩 New Message Received:", data);
          if (data.sender && data.content) {
            setMessages((prevMessages) => [...prevMessages, data]); // ✅ Last me append karo
            scrollToBottom(); // ✅ Scroll to bottom
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

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/messages/?friend_id=${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data.reverse()); // Reverse the order of messages
      scrollToBottom(); // Scroll to the bottom after fetching messages
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!socketRef.current || !message.trim() || !userId || !friendId) return;

    const messageData = {
      sender: userId,
      receiver: friendId,
      content: message,
    };

    // Add the message to the state immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: userId, content: message }, // Add the new message locally
    ]);
    scrollToBottom(); // Scroll to the bottom after sending a message

    socketRef.current.send(JSON.stringify(messageData)); // Send the message via WebSocket

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/messages/",
        messageData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("❌ Error saving message:", error.response?.data || error);
    }

    setMessage(""); // Clear the input field
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="p-4 space-y-2 bg-gray-100 h-screen flex flex-col">
      <h2 className="text-lg font-semibold">Chat with {friendName}</h2>
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-auto space-y-2"
      >
        {messages.map((msg, index) => ( // Render messages in the order they are received
          <MessageBubble
            key={index}
            message={msg.content}
            isSent={msg.sender === userId}
          />
        ))}
      </div>
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