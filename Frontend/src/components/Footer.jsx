import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"; // Icons

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        
        {/* Brand Name */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold">My Chat App</h2>
          <p className="text-sm text-gray-400">Connect with your friends anytime, anywhere.</p>
        </div>

        {/* Navigation Links */}
        <div className="mt-4 md:mt-0">
          <ul className="flex space-x-4 text-sm">
            <li>
              <Link to="/" className="hover:text-gray-400">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-400">About</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gray-400">Contact</Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-gray-400">Privacy</Link>
            </li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <Facebook size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <Twitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <Instagram size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <Linkedin size={20} />
          </a>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-4 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} My Chat App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
