import React from "react";

const About = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-md rounded-lg mt-10">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">About Us</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Welcome to our chat platform! Our goal is to provide a secure and seamless
        messaging experience for everyone.
      </p>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mt-4">Our Mission</h2>
      <p className="text-gray-600 dark:text-gray-300">
        To create a user-friendly, feature-rich chat application that connects people
        effortlessly.
      </p>
    </div>
  );
};

export default About;