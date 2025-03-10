import React, { useState } from "react";
import MessageBubble from "../components/ui/MessageBubble";
import useWebSocket from "../hooks/useWebSocket";

const ChatScreen = () => {
  const roomId = "general"; // Chat room ID (Backend ke according set karein)
    const token = localStorage.getItem("access"); // Auth Token

  const { messages, sendMessage } = useWebSocket(roomId, token);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage(""); // Clear input field
      
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
            isSent={msg.username === "me"} 
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
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
