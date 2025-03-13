import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ProfileCard = ({ name, email, profilePic }) => {

  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white"
    >
      <Card className="w-96 p-6 shadow-2xl rounded-3xl border border-gray-200 bg-white">
        <CardContent className="flex flex-col items-center">
          {/* Profile Image */}
          <motion.div whileHover={{ scale: 1.1 }} className="relative">
            <Avatar className="w-24 h-24 border-4 border-gray-300 shadow-md">
              <AvatarImage src={profilePic} alt={name} />
              <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </motion.div>

          {/* Name & Email */}
          <h2 className="mt-4 text-2xl font-bold text-gray-800">{name}</h2>
          <p className="text-gray-500">{email}</p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-all">
                Message
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button variant="outline" className="border-gray-400 text-gray-700 hover:border-gray-600">
                Add Friend
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;
