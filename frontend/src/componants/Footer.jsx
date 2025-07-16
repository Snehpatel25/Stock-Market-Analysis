import React from "react";
import {
  FaTwitter,
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaStar,
} from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 px-6 md:px-20">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src="/images/logo.png" alt="" />
            <span className="text-2xl font-bold">Stock Analysis</span>
          </div>
          <p className="text-sm text-gray-300">
            Lorem Ipsum is a placeholder text commonly used in the graphic,
            print, and publishing industries for previewing layouts and visual
            mockups.
          </p>
        </div>

        {/* Columns */}
        <div>
          <h4 className="font-semibold mb-2">Assets</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="#">Stocks</a></li>
            <li><a href="#">Mutual Funds</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Tools</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="#">MMI</a></li>
            <li><a href="#">Stock Scanner</a></li>
            <li><a href="#">MF Scanner</a></li>
            <li><a href="#">Market Movers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Learn & Share</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="#">Social</a></li>
            <li><a href="#">Learn</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Glossary</a></li>
            <li><a href="#">Stock Collection</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Fin Point</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Disclosures</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Analytical Tools</a></li>
            <li><a href="#">Community Guidelines</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        {/* Social Icons */}
        <div>
          <h4 className="font-semibold mb-2">Find Us On</h4>
          <div className="flex gap-4 text-white text-lg">
            <a href="#" aria-label="Twitter" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-blue-600">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-red-500">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Support */}
        <div className="text-center">
          <h4 className="font-semibold">Help & Support</h4>
          <p className="text-gray-300">snehp1082@gmail.com</p>
        </div>

        {/* Rating */}
        <div className="text-center">
          <h4 className="font-semibold">Loving SP Stock Analysis? Rate Us</h4>
          <div className="mt-1 flex gap-2 justify-center">
            <span className="bg-gray-800 px-4 py-1 rounded-full">8L+ Downloads</span>
            <span className="bg-gray-800 px-4 py-1 rounded-full flex items-center gap-1">
              4.5 <FaStar className="text-yellow-400" />
              App Rating
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
