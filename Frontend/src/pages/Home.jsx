import { useLocation } from "react-router-dom";
import ProfileCard from "./ProfileCard";

const Home = () => {
  const location = useLocation();
  const friendId = location.state?.friendId || null; // Friend ID extract karo

  return (
    <div>
      <h1 className="text-2xl font-bold">Home Page</h1>
      {friendId ? <ProfileCard friendId={friendId} /> : <p>No friend selected</p>}
    </div>
  );
};

export default Home;
