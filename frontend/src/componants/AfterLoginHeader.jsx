import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  User,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Newspaper,
  Briefcase,
  Cpu,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const AfterLoginHeader = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
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
    { name: "Dashboard", path: "/dashboard" },
    { name: "Market", path: "/market" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "News", path: "/news" },
    { name: "Models", path: "/models" },
    { name: "Alerts", path: "/alerts" },
  ];

  const menuItems = [
    { name: "Market", icon: <BarChart2 size={18} />, path: "/market" },
    { name: "News", icon: <Newspaper size={18} />, path: "/news" },
    { name: "Portfolio", icon: <Briefcase size={18} />, path: "/portfolio" },
    { name: "Models", icon: <Cpu size={18} />, path: "/models" },
    { name: "My Profile", icon: <UserIcon size={18} />, path: "/profile" },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/");
  };

  const profileItems = [
    {
      name: "My Profile",
      icon: <UserIcon size={18} className="text-blue-400" />,
      action: () => navigate("/profile"),
    },
    {
      name: "Settings",
      icon: <Settings size={18} className="text-gray-400" />,
      action: () => navigate("/settings"),
    },
    {
      name: "Logout",
      icon: <LogOut size={18} className="text-red-400" />,
      action: handleLogout,
    },
  ];

  return (
    <header className="w-full bg-[#0D1323] text-white flex justify-between items-center px-4 py-3 shadow-md z-50 fixed top-8">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-[#1A2036]"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="/images/logo.png"
          alt="Logo"
          className="h-8"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/32";
          }}
        />
        <span className="text-xl font-semibold hidden sm:inline">Stock Analysis</span>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex space-x-6 text-sm font-medium">
        {navItems.map((item) => (
          <motion.div
            key={item.name}
            whileHover={{ y: -2 }}
            className="hover:text-blue-400 transition-colors"
          >
            <Link to={item.path}>{item.name}</Link>
          </motion.div>
        ))}
      </nav>

      {/* Profile Dropdown */}
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setIsProfileOpen((prev) => !prev)}
          className="flex items-center gap-2 bg-white text-black px-3 py-1.5 rounded-full font-medium hover:bg-gray-100 transition"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="h-6 w-6 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/24";
              }}
            />
          ) : (
            <User size={18} className="text-gray-600" />
          )}
          <span className="hidden sm:inline">
            {isLoggedIn ? user?.name || user?.username || "User" : "Guest"}
            {user?.role === "admin" && (
              <span className="ml-1 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </span>
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
              {isLoggedIn ? (
                <>
                  <div className="p-3 border-b border-[#2a3b4e]">
                    <p className="font-medium truncate">
                      {user?.name || user?.username || "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user?.email || ""}
                    </p>
                  </div>
                  <div className="p-1">
                    {profileItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          item.action();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 hover:bg-[#2a344b] transition"
                      >
                        <span>{item.icon}</span>
                        <span className={item.name === "Logout" ? "text-red-400" : ""}>
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-[#2a344b] transition"
                >
                  <UserIcon size={18} className="text-blue-400" />
                  <span>Login</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 h-screen w-64 bg-[#0D1323] shadow-lg z-40 pt-16"
            ref={mobileMenuRef}
          >
            <div className="p-4 border-b border-[#2a3b4e]">
              {isLoggedIn ? (
                <div>
                  <p className="font-medium">
                    {user?.name || user?.username || "User"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {user?.email || ""}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-left hover:text-blue-400 transition-colors"
                >
                  <UserIcon size={18} className="text-blue-400" />
                  <span>Login</span>
                </button>
              )}
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
              {isLoggedIn && (
                <div className="border-t border-[#2a3b4e] pt-2 mt-2">
                  {profileItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        item.action();
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-[#1A2036] rounded-md transition-colors ${
                        item.name === "Logout" ? "text-red-400" : ""
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default AfterLoginHeader;