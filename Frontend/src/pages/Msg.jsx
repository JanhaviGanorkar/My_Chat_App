import { useState, useEffect, useRef } from "react";
import axios from "axios";
import MessageBubble from "../components/ui/MessageBubble";
import Spinner from "../components/Spinner";
import { useLocation } from "react-router-dom";

const Msg = () => {
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const friendName = location.state?.friendName || "Unknown";
  const friendId = location.state?.friendId;
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const socketRef = useRef(null);
  const chatContainerRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const [wsConnected, setWsConnected] = useState(false);
  const maxReconnectAttempts = 5;
  const token = localStorage.getItem("access");
  const processedMessageIds = useRef(new Set());
  const [error, setError] = useState(null);

  const addMessage = (newMessage) => {
    if (!newMessage.id) {
      newMessage.id = `temp-${Date.now()}-${Math.random()}`;
    }

    if (!processedMessageIds.current.has(newMessage.id)) {
      processedMessageIds.current.add(newMessage.id);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setTimeout(scrollToBottom, 100);
    }
  };

  useEffect(() => {
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
  }, [token]);

  useEffect(() => {
    if (!friendId) {
      setError("Friend ID is required");
      console.error("❌ Friend ID is missing");
      return;
    }
    setError(null);
  }, [friendId]);

  useEffect(() => {
    setMessages([]);
    processedMessageIds.current.clear();
    setWsConnected(false);

    if (!friendId || !token) {
      console.warn("⚠️ Missing required params:", { friendId, hasToken: !!token });
      return;
    }

    let ws = null;
    let reconnectTimeout = null;

    const connectWebSocket = () => {
      try {
        const encodedToken = encodeURIComponent(token);
        const wsUrl = `ws://127.0.0.1:8000/ws/chat/${friendId}/?token=${encodedToken}`;

        ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          console.log("✅ WebSocket connected");
          setWsConnected(true);
          reconnectAttempts.current = 0;
          setError(null);
        };

        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.sender && data.content) {
              addMessage(data);
            }
          } catch (error) {
            console.error("⚠️ Error parsing message:", error);
          }
        };

        ws.onclose = (event) => {
          console.warn("❌ WebSocket closed:", event.code, event.reason);
          setWsConnected(false);

          if (reconnectAttempts.current < maxReconnectAttempts) {
            const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
            console.log(`🔄 Reconnecting in ${timeout / 1000}s...`);

            reconnectTimeout = setTimeout(() => {
              reconnectAttempts.current += 1;
              connectWebSocket();
            }, timeout);
          }
        };

        ws.onerror = (error) => {
          console.error("⚠️ WebSocket error:", error);
          setError("Failed to connect to chat server");
        };
      } catch (error) {
        console.error("❌ Failed to establish WebSocket connection:", error);
        setError("Failed to establish chat connection");
      }
    };

    connectWebSocket();
    fetchMessages();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounting");
        socketRef.current = null;
      }
    };
  }, [friendId, token]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/messages/?friend_id=${friendId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      processedMessageIds.current.clear();
      const initialMessages = response.data.reverse();

      initialMessages.forEach((msg) => {
        processedMessageIds.current.add(msg.id);
      });

      setMessages(initialMessages);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("❌ Failed to fetch messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!socketRef.current?.readyState === WebSocket.OPEN || !wsConnected) {
      setError("Chat connection lost. Reconnecting...");
      return;
    }

    if (!message.trim() || !friendId) return;

    const messageData = {
      content: message.trim(),
      receiver: friendId,
    };

    try {
      // Only send through WebSocket, don't add to state here
      socketRef.current.send(JSON.stringify(messageData));
      setMessage(""); // Clear input field
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setError("Failed to send message");
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="p-4 space-y-2 h-screen mt-16 flex flex-col bg-gray-100 text-black">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg mb-2">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Chat with {friendName}</h2>
      </div>

      <div ref={chatContainerRef} className="flex-grow overflow-auto space-y-2 p-2 bg-white rounded-lg shadow-md">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <svg className="w-16 h-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h6m-6 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm ml-2">No messages yet</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} message={msg.content} isSent={msg.sender === userId} />
          ))
        )}
      </div>

      <div className="flex items-center p-2 bg-white shadow-md rounded-lg">
        <input
          type="text"
          disabled={!wsConnected || !friendId}
          className={`flex-grow p-2 border rounded-lg outline-none bg-white text-black
            placeholder-gray-400 focus:ring-2 focus:ring-blue-500 
            ${(!wsConnected || !friendId) ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder={!wsConnected ? "Connecting..." : "Type a message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && wsConnected && friendId && sendMessage()}
        />

        <button
          onClick={sendMessage}
          disabled={!wsConnected || !friendId}
          className={`ml-2 bg-blue-500 text-white p-2 rounded-lg
            ${(!wsConnected || !friendId) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {!wsConnected ? 'Connecting...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Msg;
