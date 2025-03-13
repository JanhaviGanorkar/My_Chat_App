import React from "react";
import ChatRoom from "../pages/Msg";

const ChatRoom = () => {
    const roomId = "general"; // Chat room ID (Backend ke according set karein)
    const token = localStorage.getItem("token"); // Auth Token

    return (
        <div>
            <h2>Chat Room</h2>
            <ChatRoom roomId={roomId} token={token} />
        </div>
    );
};

export default ChatRoom;
