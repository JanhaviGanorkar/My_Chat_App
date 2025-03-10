import React from "react";
import Chat from "./Chat";

const ChatRoom = () => {
    const roomId = "general"; // Chat room ID (Backend ke according set karein)
    const token = localStorage.getItem("token"); // Auth Token

    return (
        <div>
            <h2>Chat Room</h2>
            <Chat roomId={roomId} token={token} />
        </div>
    );
};

export default ChatRoom;
