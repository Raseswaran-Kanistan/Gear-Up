
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gearup-dark text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">GearUp</h3>
            <p className="text-gray-300">Your one-stop shop for all outdoor adventure gear.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-300 hover:text-white">Products</Link></li>
              <li><Link to="/cart" className="text-gray-300 hover:text-white">Cart</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="text-gray-300 not-italic">
              <p>123 Adventure Way</p>
              <p>Outdoor City, OC 98765</p>
              <p className="mt-2">Email: support@gearup.com</p>
              <p>Phone: (555) 123-4567</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GearUp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
