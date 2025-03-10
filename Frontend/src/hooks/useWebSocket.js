import { useEffect, useState } from "react";

const useWebSocket = (roomId, token) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
console.log(roomId, token)
    // useEffect(() => {
    //     if (!roomId) return;

    //     // ✅ WebSocket URL
    //     const wsUrl = `ws://127.0.0.1:8080/chat/${roomId}/?token=${token}`;
    //     console.log("Connecting to WebSocket:", wsUrl);

    //     const ws = new WebSocket(wsUrl);

    //     ws.onopen = () => {
    //         console.log("✅ WebSocket Connected", ws.readyState);
    //     };

    //     ws.onmessage = (event) => {
    //         try {
    //             const data = JSON.parse(event.data);
    //             console.log("📩 New Message:", data);

    //             if (data?.message) {
    //                 setMessages((prev) => [...prev, data]);
    //             } else {
    //                 console.warn("⚠️ Unexpected Message Format:", data);
    //             }
    //         } catch (error) {
    //             console.error("❌ Error Parsing WebSocket Message:", error);
    //         }
    //     };

    //     ws.onclose = (event) => {
    //         console.warn("🔌 WebSocket Disconnected", event.code, event.reason);
    //     };

    //     ws.onerror = (error) => {
    //         console.error("❌ WebSocket Error:", error);
    //     };

    //     setSocket(ws);
    //     console.log(ws)

    //     return () => {
    //         console.log("Cleaning up WebSocket...");
    //         ws.close();
    //     };
    // }, [roomId, token]);


    if (!roomId) return;
try{
    const wsUrl = `ws://127.0.0.1:8080/chat/${roomId}/?token=${token}`;
    console.log("Connecting to WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);
    setSocket(ws);
    console.log(ws)

    ws.onopen = () => {
        console.log("✅ WebSocket Connected", ws.readyState);
    };
} catch(error){
    console.log("websoc err")

}
    // ✅ WebSocket URL
    // const wsUrl = `ws://127.0.0.1:8080/chat/${roomId}/?token=${token}`;
    // console.log("Connecting to WebSocket:", wsUrl);

    // const ws = new WebSocket(wsUrl);

    // ws.onopen = () => {
    //     console.log("✅ WebSocket Connected", ws.readyState);
    // };

    // ws.onmessage = (event) => {
    //     try {
    //         const data = JSON.parse(event.data);
    //         console.log("📩 New Message:", data);

    //         if (data?.message) {
    //             setMessages((prev) => [...prev, data]);
    //         } else {
    //             console.warn("⚠️ Unexpected Message Format:", data);
    //         }
    //     } catch (error) {
    //         console.error("❌ Error Parsing WebSocket Message:", error);
    //     }
    // };

    // ws.onclose = (event) => {
    //     console.warn("🔌 WebSocket Disconnected", event.code, event.reason);
    // };

    // ws.onerror = (error) => {
    //     console.error("❌ WebSocket Error:", error);
    // };

  
    

    // return () => {
        // console.log("Cleaning up WebSocket...");
        // ws.close();
    // };
    const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ message }));
            console.log("📤 Message Sent:", message);
        } else {
            console.warn("❌ WebSocket Not Connected, Cannot Send Message");
        }
    };

    return { messages, sendMessage };
};

export default useWebSocket;
