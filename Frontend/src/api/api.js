import axios from "axios";
import React, { useEffect } from "react";

export default function Api() {
  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/friends/list/");
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 
}
