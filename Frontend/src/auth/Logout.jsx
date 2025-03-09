import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
  const logout = useAuthStore((state) => state.logout);

  return <Button onClick={logout}>Logout</Button>;
};

export default LogoutButton;
