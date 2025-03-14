import { useParams } from "react-router-dom";

const User = () => {
  const { id } = useParams();

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold">User Profile</h2>
      <p className="text-gray-700">User ID: {id}</p>
    </div>
  );
};

export default User;
