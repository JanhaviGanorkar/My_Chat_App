import { create } from "zustand";
import axios from "axios";

export const useFriendsStore = create((set) => ({
  friends: [], // ✅ Default empty array

  loadFriends: async () => {
    try {
      const token = localStorage.getItem("access");
      const headers = {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      };

      const response = await axios.get("http://127.0.0.1:8000/friends/list/", { headers });
      console.log(response.data.friends[1].friend__name)

      if (response.data && Array.isArray(response.data.friends)) {
        set({ friends: response.data.friends }); // ✅ Extract only friends array
      } else {
        set({ friends: [] }); // ✅ Fallback to empty array
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      set({ friends: [] }); // ✅ Error handling
    }
  },
}));
