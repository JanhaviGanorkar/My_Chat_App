import axios from "axios";

const API_URL = "friends/accept/";

export const acceptFriendRequest = async (requestId) => {
  const response = await axios.post(`${API_URL}${requestId}/`);
  return response.data;
};
