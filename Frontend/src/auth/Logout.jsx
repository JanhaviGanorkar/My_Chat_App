import { useAuthStore } from "../store/authStore";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-all"
      >
        <LogOut size={18} />
        Logout
      </Button>
    </motion.div>
  );
};

export default LogoutButton;
