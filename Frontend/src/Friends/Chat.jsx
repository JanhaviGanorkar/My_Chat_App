// import React, { useEffect, useState } from 'react';
// import { useFriendsStore } from "../store/FriendStore";
// const Chat = ({ roomName }) => {
//     const [messages, setMessages] = useState([]);
//     const [message, setMessage] = useState('');
//     const [socket, setSocket] = useState(null);
//     const { friends, loadFriends } = useFriendsStore();

//     useEffect(() => {
//         const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
//         setSocket(ws);

//         ws.onopen = () => {
//             console.log('WebSocket connection opened');
//         };

//         ws.onmessage = (e) => {
//             try {
//                 const data = JSON.parse(e.data);
//                 console.log("Received WebSocket Message:", data);  // Debugging ke liye
//                 setMessages((prevMessages) => [...prevMessages, data.message]);
//             } catch (error) {
//                 console.error("Error parsing WebSocket message:", error);
//             }
//         };
        

//         ws.onclose = () => {
//             console.log('WebSocket connection closed');
//         };

//         ws.onerror = (e) => {
//             console.error('WebSocket error:', e);
//         };

//         return () => {
//             ws.close();
//         };
//     }, [roomName]);

//     const sendMessage = () => {
//         if (socket && message.trim()) {
//             socket.send(JSON.stringify({
//                 type: "chat_message",  // Type match karna zaroori hai
//                 message: message
//             }));
//             setMessage('');
//         }
//     };
    

//     return (
//         <div>
//             <div>
//                 <input type="text" />
//                 {messages.map((msg, index) => (
//                     <div key={index}>{msg}</div>
//                 ))}
//             </div>
//             <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//             />
//             <button onClick={sendMessage}>Send</button>
//         </div>
//     );
// };

// export default Chat;
