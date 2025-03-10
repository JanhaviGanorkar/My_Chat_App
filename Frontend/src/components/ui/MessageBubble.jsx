import { motion } from "framer-motion";

const MessageBubble = ({ message, isSent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`p-3 rounded-lg ${
        isSent ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black"
      } w-fit max-w-xs`}
    >
      {message}
    </motion.div>
  );
};

export default MessageBubble;