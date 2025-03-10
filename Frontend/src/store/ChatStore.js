import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ChatStore() {
  const fetchFriends = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/friends/list/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add auth if needed
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return <div>Check console for friends list</div>;
}
