import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      alert("Login successful!");
      navigate("/userprofile");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-96 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Welcome Back! 👋</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Log in to continue</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={18} />
            <Input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="pl-10" 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={18} />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="pl-10" 
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-all"
          >
            Login
          </Button>
        </form>

        {/* Additional Options */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <Link to="/forgot-password" className="hover:underline">
            Forgot Password?
          </Link>
        </div>
        <p className="mt-2 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
