import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = useAuthStore((state) => state.register);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(name, email, password);
    if (res.success) {
      alert("Registration successful! Please login.");
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-900 dark:to-gray-800">
      <motion.div 
        className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl w-96 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
          Create an Account 🚀
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Join us and start connecting with friends!</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" size={18} />
            <Input 
              type="text" 
              placeholder="Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="pl-10" 
            />
          </div>
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
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all"
          >
            Register
          </Button>
        </form>

        {/* Login Link */}
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
