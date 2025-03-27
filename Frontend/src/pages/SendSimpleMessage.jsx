import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "../store/authStore";

const SendSimpleMessage = () => {
    const [receiverId, setReceiverId] = useState("");
    const [message, setMessage] = useState("");
    const { accessToken } = useAuthStore();

    const handleSendMessage = async () => {
        if (!receiverId || !message) {
            alert("Receiver ID and message are required");
            return;
        }

        try {
            const headers = { Authorization: accessToken ? `Bearer ${accessToken}` : "" };
            await axios.post("http://127.0.0.1:8000/messages/send_simple/", {
                receiver_id: receiverId,
                content: message
            }, { headers });

            alert("Message sent successfully");
            setReceiverId("");
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Send Simple Message</h2>
            <div className="w-full max-w-md">
                <Input 
                    type="text"
                    placeholder="Receiver ID"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    required
                />
                <Input 
                    type="text"
                    placeholder="Type your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
                <Button onClick={handleSendMessage} className="w-full mt-4">Send</Button>
            </div>
        </div>
    );
};

export default SendSimpleMessage;
