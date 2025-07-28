import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';

const LoginPage = () => {
  const [userType, setUserType] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = [];
    if (!username.trim()) errors.push('Username is required');
    if (!password.trim()) errors.push('Password is required');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setLoading(false);
      return;
    }

    try {
      const user = await login({
        username: username.trim(),
        password: password.trim(),
        userType
      });

      setUsername('');
      setPassword('');

      if (user?.isAdmin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }

    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please try again.';

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (err.response.status === 403) {
          errorMessage = 'Account not authorized';
        } else if (err.response.status === 404) {
          errorMessage = 'Authentication service unavailable';
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        }
      } else if (err.request) {
        errorMessage = 'Network error - please check your connection';
      } else if (err.message.includes('timeout')) {
        errorMessage = 'Request timeout - server not responding';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative bg-cover bg-center" 
         style={{ backgroundImage: `url('/images/login-bg.png')` }}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {/* Loading spinner */}
      {loading && (
        <div className="absolute z-50 inset-0 bg-black/70 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-t-transparent border-cyan-400 rounded-full"
          />
        </div>
      )}

      {/* Main card container */}
      <div className="relative z-10 w-full max-w-md sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-2 sm:mx-4 overflow-hidden rounded-xl sm:rounded-3xl shadow-lg bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300">
        {/* Image section - hidden on small screens */}
        <div className="hidden sm:block sm:w-1/2 absolute h-full bg-cover bg-center"
             style={{ backgroundImage: `url('/images/login-inner.png')` }}>
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Form section */}
        <div className="w-full sm:w-2/3 sm:ml-auto bg-[#0d1520] text-white px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-10 lg:py-14 relative">
          {/* Decorative elements */}
          <div className="hidden sm:block absolute top-[-50px] right-[-50px] w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] bg-[#1e3a5f] opacity-20 blur-2xl rounded-full z-0" />
          <div className="hidden sm:block absolute bottom-[-60px] left-[-60px] w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] bg-[#0f2a47] opacity-20 blur-xl rounded-full z-0" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8">Hi, Welcome Back 👋</h3>

            {/* User type selector */}
            <div className="flex items-center mb-4 sm:mb-6 md:mb-8 rounded-lg sm:rounded-xl overflow-hidden border border-white/20 shadow-inner">
              {['admin', 'user'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className={`w-1/2 py-2 text-sm sm:text-base md:text-lg font-medium sm:font-semibold transition-all duration-200 ${
                    userType === type
                      ? 'bg-gradient-to-r from-[#2e4b68] to-[#395d84] text-white shadow-md'
                      : 'bg-[#1b2735] text-gray-300 hover:bg-[#263545]'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2 sm:p-3 mb-3 sm:mb-4 bg-red-900/50 text-red-300 rounded-md sm:rounded-lg text-xs sm:text-sm flex items-start gap-2"
              >
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                {/* Username field */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full p-2 sm:p-3 rounded-md sm:rounded-lg bg-[#1b2738] text-white placeholder-gray-500 border border-[#2a3b4e] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 text-sm sm:text-base transition-all duration-200 shadow-inner"
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-xs sm:text-sm text-gray-400 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full p-2 sm:p-3 pr-8 sm:pr-10 rounded-md sm:rounded-lg bg-[#1b2738] text-white placeholder-gray-500 border border-[#2a3b4e] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 text-sm sm:text-base transition-all duration-200 shadow-inner"
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-2 sm:top-3 text-gray-400 hover:text-white"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5 w-4 h-4" /> : <Eye size={18} className="sm:w-5 sm:h-5 w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  disabled={loading}
                  className={`w-full py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base md:text-lg font-medium sm:font-semibold text-white shadow-md transition-all duration-200 ${
                    loading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                  }`}
                >
                  {loading ? 'Authenticating...' : 'Log In'}
                </motion.button>

                {/* Sign up link */}
                <p className="text-center text-xs sm:text-sm text-gray-400">
                  Don't have an account?{' '}
                  <NavLink
                    to="/signup"
                    className="text-blue-400 hover:underline hover:text-white transition-colors"
                  >
                    Sign up
                  </NavLink>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;