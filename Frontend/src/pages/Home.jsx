import { useLocation } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import EditProfile from "../Form/EditProfile";

const Home = () => {
  const location = useLocation();
  const friendId = location.state?.friendId || null; // Friend ID extract karo
  const userId = location.state.userId || null;
  return (
    <div>
      <h1 className="text-2xl font-bold">Home Page</h1>
      {friendId ? <ProfileCard friendId={friendId} /> : <p>No friend selected</p>}
      {userId ? <EditProfile userId={userId}/> : <p>No Profile to edit</p>}
    </div>
  );
};

export default Home;
