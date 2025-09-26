import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-850 text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
         <div className="text-sm text-gray-600">
  © 2025 Clouditect. All rights reserved.
</div>
          
          <div className="flex space-x-4">
            <a href="/privacy" className="text-sm hover:text-white transition duration-150 ease-in-out">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm hover:text-white transition duration-150 ease-in-out">
              Terms of Service
            </a>
            <a href="/contact" className="text-sm hover:text-white transition duration-150 ease-in-out">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;