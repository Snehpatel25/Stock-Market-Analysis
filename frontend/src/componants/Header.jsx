import React from "react";
import { User, Search } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const Header = ({ onLogin }) => {
  return (
    <header className="w-full bg-[#0b1326] text-white px-4 sm:px-8 md:px-15 py-2 mt-2 sm:mt-4 md:mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
      {/* Logo Section */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between">
        <div className="flex items-center gap-2">
          <span>
            <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
          </span>
          <span className="font-semibold text-white text-lg sm:text-xl">
            Stock Analysis
          </span>
        </div>
        
        {/* Mobile Login Button - visible only on small screens */}
        <button className="sm:hidden flex items-center gap-2 bg-white text-black font-semibold px-3 py-1 rounded-full hover:bg-gray-200 transition">
          <NavLink to="/login" className="flex">
            <User className="w-4 h-4 mt-1" />
          </NavLink>
        </button>
      </div>

      

      {/* Desktop Login Button - hidden on mobile */}
      <button className="hidden sm:flex items-center gap-2 bg-white text-black font-semibold px-4 py-1 rounded-full hover:bg-gray-200 transition">
        <NavLink to="/login" className="flex">
          <User className="w-4 mr-2 h-4 mt-1" />
          Login
        </NavLink>
      </button>
    </header>
  );
};

export default Header;