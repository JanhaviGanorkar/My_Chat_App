import React, { useState, useEffect } from "react";
import MessageBubble from "../components/ui/MessageBubble";
import { useFriendsStore } from "../store/FriendStore";

const ChatScreen = ({ roomName = "general" }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const { friends, loadFriends } = useFriendsStore();

  const username = localStorage.getItem("username") || "Guest";
  const token = localStorage.getItem("access");

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8001/ws/chat/${roomName}/`);
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log("Received WebSocket Message:", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    return () => {
      ws.close();
    };
  }, [roomName]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.send(
        JSON.stringify({
          type: "chat_message",
          message: message,
          username: username, // Ensure username is included
        })
      );
      setMessage("");
    }
  };

  return (
    <div className="p-4 space-y-2 bg-gray-100 h-screen flex flex-col">
      {/* Messages List */}
      <div className="flex-grow overflow-auto space-y-2">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg.message}
            isSent={msg.username === username}
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
