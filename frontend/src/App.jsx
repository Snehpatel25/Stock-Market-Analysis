import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PriceBar from "./componants/PriceBar";
import Main from "./Pages/Main";
import LoginPage from "./Pages/LoginPage";
import SignUp from "./Pages/SignUp";
import AdminDashboard from "./Pages/AdminDashboard";
import MyProfile from "./Pages/MyProfile";
import Market from "./Pages/Market";
import News from "./Pages/News";
import Alerts from "./Pages/Alerts";
import Models from "./Pages/Models";
import Portfolio from "./Pages/Portfolio";

const pageVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoggedIn, loading, user } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#0b1320] flex items-center justify-center">Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />; // Redirect to home if not admin
  }

  return children;
};

const PostLoginRedirect = () => {
  const { user } = useAuth();
  
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />; // Changed to /admin/dashboard
  }
  return <Navigate to={`/${user?.username}`} replace />;
};

const App = () => {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0b1320] text-white flex flex-col">
        <PriceBar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <Main />
                </motion.div>
              } />
              <Route path="/login" element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <LoginPage />
                </motion.div>
              } />
              <Route path="/signup" element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                >
                  <SignUp />
                </motion.div>
              } />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <AdminDashboard />
                  </motion.div>
                </ProtectedRoute>
              } />
              
              {/* User profile route */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <MyProfile />
                  </motion.div>
                </ProtectedRoute>
              } />
              
              {/* Regular user routes */}
              <Route path="/:username" element={
                <ProtectedRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <Main />
                  </motion.div>
                </ProtectedRoute>
              } />
              <Route path="/market" element={
                <ProtectedRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <Market />
                  </motion.div>
                </ProtectedRoute>
              } />
              <Route path="/news" element={
                <ProtectedRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <News />
                  </motion.div>
                </ProtectedRoute>
              } />
              <Route path="/alerts" element={
                <ProtectedRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <Alerts />
                  </motion.div>
                </ProtectedRoute>
              } />
              <Route path="/models" element={
                <ProtectedRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <Models />
                  </motion.div>
                </ProtectedRoute>
              } />
              <Route path="/portfolio" element={
                <ProtectedRoute>
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <Portfolio />
                  </motion.div>
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;