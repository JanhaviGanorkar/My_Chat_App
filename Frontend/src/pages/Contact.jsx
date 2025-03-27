const Contact = () => {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg mt-10">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Have any questions? Feel free to reach out!
        </p>
        <form className="mt-6">
          <label className="block text-gray-700 dark:text-gray-300">Your Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 mt-2"
            placeholder="Enter your name"
          />
  
          <label className="block text-gray-700 dark:text-gray-300 mt-4">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 mt-2"
            placeholder="Enter your email"
          />
  
          <label className="block text-gray-700 dark:text-gray-300 mt-4">Message</label>
          <textarea
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 mt-2"
            placeholder="Enter your message"
            rows="4"
          ></textarea>
  
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    );
  };
  
  export default Contact;
  