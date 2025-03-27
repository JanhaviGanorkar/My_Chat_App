import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MessageBubble from "../components/ui/MessageBubble";
import Spinner from "../components/Spinner";
import { Moon, Sun } from "lucide-react";

const ChatScreen = () => {
  const location = useLocation();
  const friendName = location.state?.friendName || "Unknown";
  const friendId = location.state?.friendId;

  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);
  const token = localStorage.getItem("access");

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

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

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${friendId}/?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket connected");

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log("📩 New Message Received:", data);
        if (data.sender && data.content) {
          setMessages((prevMessages) => [...prevMessages, data]);
          setTimeout(scrollToBottom, 100);
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
      setMessages(response.data.reverse());
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!socketRef.current || !message.trim() || !userId || !friendId) return;

    const messageData = { sender: userId, receiver: friendId, content: message };

    setMessages((prevMessages) => [...prevMessages, { sender: userId, content: message }]);
    setTimeout(scrollToBottom, 100);

    socketRef.current.send(JSON.stringify(messageData));

    try {
      await axios.post("http://127.0.0.1:8000/api/messages/", messageData, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("❌ Error saving message:", error.response?.data || error);
    }

    setMessage("");
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    setDarkMode(!darkMode);
  };

  return (
    <div className={`p-4 space-y-2 h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-blue-600 dark:bg-blue-900 text-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Chat with {friendName}</h2>
        {/* <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
          {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-gray-800" />}
        </button> */}
      </div>

      {/* Chat Messages */}
      <div ref={chatContainerRef} className="flex-grow overflow-auto space-y-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {messages.length === 0 ? (
          <Spinner />
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} message={msg.content} isSent={msg.sender === userId} />
          ))
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center p-2 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg outline-none bg-white dark:bg-gray-900 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-2   rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
