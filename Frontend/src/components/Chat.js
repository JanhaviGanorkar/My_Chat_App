import React, { useEffect, useState } from 'react';
import { useFriendsStore } from '../store/FriendStore';
const Chat = ({ roomName }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
        setSocket(ws);

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.onerror = (e) => {
            console.error('WebSocket error:', e);
        };

        return () => {
            ws.close();
        };
    }, [roomName]);

    const sendMessage = () => {
        try {
            
            if (socket && message) {
                socket.send(JSON.stringify({ message }));
                setMessage('');
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
