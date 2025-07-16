import React from 'react';
import {
  FaTwitter,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaStar,
} from "react-icons/fa";

function AllPageFooter() {
  return (
    <footer className='bg-black text-white py-6 sm:py-8 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20'>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto">
        {/* Top Section - Social, Support, Rating */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8 md:gap-4 text-sm">
          
          {/* Social Icons - Full width on mobile, centered */}
          <div className="w-full md:w-auto text-center md:text-left">
            <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base md:text-sm">Find Us On</h4>
            <div className="flex justify-center md:justify-start gap-4 sm:gap-5 text-white text-lg sm:text-xl md:text-lg">
              <a 
                href="#" 
                aria-label="Twitter" 
                className="hover:text-blue-400 transition-colors duration-200 p-1"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                aria-label="Instagram" 
                className="hover:text-pink-500 transition-colors duration-200 p-1"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                aria-label="Facebook" 
                className="hover:text-blue-600 transition-colors duration-200 p-1"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                aria-label="YouTube" 
                className="hover:text-red-500 transition-colors duration-200 p-1"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Support - Full width on mobile, centered */}
          <div className="w-full md:w-auto text-center">
            <h4 className="font-semibold text-sm sm:text-base md:text-sm">Help & Support</h4>
            <p className="text-gray-300 mt-1 sm:mt-2 text-xs sm:text-sm md:text-xs">
              <a 
                href="mailto:snehp1082@gmail.com" 
                className="hover:text-blue-400 transition-colors duration-200 inline-block py-1 px-2"
              >
                snehp1082@gmail.com
              </a>
            </p>
          </div>

          {/* Rating - Full width on mobile, centered */}
          <div className="w-full md:w-auto text-center">
            <h4 className="font-semibold text-sm sm:text-base md:text-sm">Loving SP Stock Analysis?</h4>
            <h4 className="font-semibold text-sm sm:text-base md:text-sm mb-1 sm:mb-2">Rate Us</h4>
            <div className="mt-1 sm:mt-2 flex flex-row flex-wrap justify-center gap-2">
              <span className="bg-gray-800 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-xs whitespace-nowrap">
                8L+ Downloads
              </span>
              <span className="bg-gray-800 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full flex items-center justify-center gap-1 text-xs sm:text-xs whitespace-nowrap">
                4.5 <FaStar className="text-yellow-400 text-xs sm:text-sm" />
                App Rating
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Links */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            {/* Copyright Text */}
            <p className="text-gray-400 text-xs sm:text-sm order-2 sm:order-1">
              © {new Date().getFullYear()} SP Stock Analysis. All rights reserved.
            </p>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 order-1 sm:order-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm whitespace-nowrap">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm whitespace-nowrap">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm whitespace-nowrap">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AllPageFooter;