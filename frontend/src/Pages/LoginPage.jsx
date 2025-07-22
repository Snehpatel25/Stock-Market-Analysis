// src/Pages/LoginPage.jsx
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
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{
        backgroundImage: `url('/images/login-bg.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />

      {loading && (
        <div className="absolute z-50 inset-0 bg-black/70 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-16 h-16 border-4 border-t-transparent border-cyan-400 rounded-full"
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col md:flex-row max-w-5xl w-full overflow-hidden rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] bg-white/10 backdrop-blur-2xl border border-white/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)]">
        <div
          className="relative md:w-1/2 w-full bg-center"
          style={{
            backgroundImage: `url('/images/login-inner.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="md:w-2/3 w-full bg-[#0d1520] text-white px-10 py-14 relative overflow-hidden border-l border-white/10">
          <div className="absolute top-[-80px] right-[-80px] w-[200px] h-[200px] bg-[#1e3a5f] opacity-20 blur-3xl rounded-full z-0" />
          <div className="absolute bottom-[-100px] left-[-100px] w-[250px] h-[250px] bg-[#0f2a47] opacity-20 blur-2xl rounded-full z-0" />

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <h3 className="text-4xl font-extrabold mb-8">Hi, Welcome Back 👋</h3>

            <div className="flex items-center mb-8 rounded-xl overflow-hidden border border-white/20 shadow-inner backdrop-blur-sm">
              {['admin', 'user'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setUserType(type)}
                  className={`w-1/2 py-2 text-lg font-semibold transition-all duration-300 ${
                    userType === type
                      ? 'bg-gradient-to-r from-[#2e4b68] to-[#395d84] text-white shadow-md'
                      : 'bg-[#1b2735] text-gray-300 hover:bg-[#263545]'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 mb-4 bg-red-900/50 text-red-300 rounded-lg text-sm flex items-start gap-2"
              >
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full p-3 rounded-lg bg-[#1b2738] text-white placeholder-gray-500 border border-[#2a3b4e] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all duration-300 shadow-inner"
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full p-3 pr-10 rounded-lg bg-[#1b2738] text-white placeholder-gray-500 border border-[#2a3b4e] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 transition-all duration-300 shadow-inner"
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: loading ? 1 : 1.03 }}
                  whileTap={{ scale: loading ? 1 : 0.97 }}
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-lg font-semibold text-white shadow-md transition-all duration-300 ${
                    loading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                  }`}
                >
                  {loading ? 'Authenticating...' : 'Log In'}
                </motion.button>

                <p className="text-center text-sm mt-2 text-gray-400">
                  Don't have an account?{' '}
                  <NavLink
                    to="/signup"
                    className="text-blue-400 hover:underline hover:text-white transition"
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