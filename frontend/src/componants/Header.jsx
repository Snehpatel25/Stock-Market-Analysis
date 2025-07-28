import React, { useState, useEffect, useRef } from "react";
import { User, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Market", path: "/market" },
    { name: "News", path: "/news" },
    { name: "Alerts", path: "/alerts" },
    { name: "Portfolio", path: "/portfolio" },
  ];

  return (
    <header className="w-full bg-[#0D1323] text-white flex justify-between items-center px-4 py-3 sm:px-8 md:mt-2 shadow-md z-40 fixed top-[18px]">
      {/* Mobile Menu Button - Only shown on mobile */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-[#1A2036]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Logo - Centered on mobile, left-aligned on desktop */}
      <div
        className="flex items-center gap-2 cursor-pointer md:mr-6"
        onClick={() => navigate("/")}
      >
        <img
          src="/images/logo.png"
          alt="SP Stock Analysis"
          className="h-8 w-8"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/32";
          }}
        />
        <span className="text-lg font-semibold hidden sm:inline whitespace-nowrap">SP Stock Analysis</span>
      </div>

      {/* Desktop Navigation Links - Hidden on mobile */}
      <nav className="hidden md:flex space-x-4 lg:space-x-6 text-sm font-medium">
        {navItems.map((item) => (
          <motion.div
            key={item.name}
            whileHover={{ y: -2 }}
            className="hover:text-blue-400 transition-colors whitespace-nowrap"
          >
            <Link to={item.path}>{item.name}</Link>
          </motion.div>
        ))}
      </nav>

      {/* Spacer to center nav items on wider screens */}
      <div className="flex-1 hidden xl:block"></div>

      {/* Profile Dropdown - Right-aligned */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-white text-black px-3 py-1.5 rounded-full font-medium hover:bg-gray-100 transition whitespace-nowrap"
        >
          <User size={18} className="text-gray-600" />
          <span className="hidden sm:inline">Login</span>
          {isProfileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <AnimatePresence>
          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-56 bg-[#1A2036] rounded-lg shadow-lg border border-[#2a3b4e] z-50"
            >
              <button
                onClick={() => {
                  navigate("/login");
                  setIsProfileOpen(false);
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-[#2a344b] transition"
              >
                <User size={18} className="text-blue-400" />
                <span>Login</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu - Full screen overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[8px] left-0 h-[calc(100vh-8px)] w-64 bg-[#0D1323] shadow-lg z-30 pt-16"
            ref={mobileMenuRef}
          >
            <div className="p-4 border-b border-[#2a3b4e]">
              <button
                onClick={() => {
                  navigate("/login");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-left hover:text-blue-400 transition-colors w-full"
              >
                <User size={18} className="text-blue-400" />
                <span>Login</span>
              </button>
            </div>
            <nav className="flex flex-col p-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 hover:bg-[#1A2036] rounded-md transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;