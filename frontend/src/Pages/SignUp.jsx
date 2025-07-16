import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    mobile: '',
    countryCode: '+91',
    isAdmin: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid email address';
      isValid = false;
    }

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(formData.password)) {
      errors.password = 'Must include uppercase, lowercase, number, and special character';
      isValid = false;
    }

    if (!formData.mobile) {
      errors.mobile = 'Mobile number is required';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      errors.mobile = 'Mobile number must be 10 digits';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSignUp();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSignUp = async () => {
    setError('');
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          let errorMessage = 'Registration failed: ';
          
          if (data.exists?.email && data.exists?.username) {
            errorMessage += 'Email and username already exist';
          } else if (data.exists?.email) {
            errorMessage += 'Email already exists';
          } else if (data.exists?.username) {
            errorMessage += 'Username already exists';
          } else {
            errorMessage += data.message || 'User already exists';
          }
          
          throw new Error(errorMessage);
        }
        
        throw new Error(data.message || 'Registration failed');
      }

      alert(`Sign-up successful as ${formData.isAdmin ? 'Admin' : 'User'}! Please log in.`);
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('/images/signup-bg.png')` }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0" />
      
      <div className="relative z-10 w-full max-w-6xl">
        <div className="flex flex-col lg:flex-row rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.7)] bg-white/10 border border-white/10 backdrop-blur-2xl">
          {/* Left side with image - hidden on small screens */}
          <div className="hidden lg:block lg:w-1/2 min-h-[400px] lg:min-h-[600px] bg-cover bg-center" style={{ backgroundImage: `url('/images/signup-inner.png')` }}>
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Right side with form */}
          <form onSubmit={handleSubmit} className="w-full lg:w-1/2 bg-[#0d1520] text-white px-6 sm:px-8 md:px-12 lg:px-16 py-8 sm:py-10 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-[-80px] right-[-80px] w-[200px] h-[200px] bg-[#1e3a5f] opacity-20 blur-3xl rounded-full z-0" />
            <div className="absolute bottom-[-100px] left-[-100px] w-[250px] h-[250px] bg-[#0f2a47] opacity-20 blur-2xl rounded-full z-0" />

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <div className="text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold mb-2">Create Account</h2>
                <h4 className="text-lg sm:text-xl font-semibold flex items-center justify-center lg:justify-start mb-5 gap-1">
                  <img src="/images/logo.png" alt="Logo" className="h-7 sm:h-8" />
                  <span className="text-white">Stock Analysis</span>
                </h4>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 mb-2 sm:mb-4 bg-red-900/50 text-red-300 rounded-lg text-sm flex items-start gap-2"
                  >
                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <span>{error}</span>
                      {error.includes('already exists') && (
                        <div className="mt-2">
                          <NavLink to="/login" className="text-cyan-300 hover:underline">
                            Click here to login instead
                          </NavLink>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Form fields */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm text-gray-300 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className={`w-full px-4 py-2 rounded-lg sm:rounded-xl bg-[#1b2738] placeholder-gray-400 text-white focus:outline-none focus:ring-2 border transition shadow-inner ${
                        fieldErrors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-[#2a3b4e] focus:ring-cyan-500'
                      }`}
                    />
                    {fieldErrors.firstName && <p className="text-red-400 text-xs mt-1">{fieldErrors.firstName}</p>}
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm text-gray-300 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className={`w-full px-4 py-2 rounded-lg sm:rounded-xl bg-[#1b2738] placeholder-gray-400 text-white focus:outline-none focus:ring-2 border transition shadow-inner ${
                        fieldErrors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-[#2a3b4e] focus:ring-cyan-500'
                      }`}
                    />
                    {fieldErrors.lastName && <p className="text-red-400 text-xs mt-1">{fieldErrors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={`w-full px-4 py-2 rounded-lg sm:rounded-xl bg-[#1b2738] placeholder-gray-400 text-white focus:outline-none focus:ring-2 border transition shadow-inner ${
                      fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#2a3b4e] focus:ring-cyan-500'
                    }`}
                  />
                  {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className={`w-full px-4 py-2 rounded-lg sm:rounded-xl bg-[#1b2738] placeholder-gray-400 text-white focus:outline-none focus:ring-2 border transition shadow-inner ${
                      fieldErrors.username ? 'border-red-500 focus:ring-red-500' : 'border-[#2a3b4e] focus:ring-cyan-500'
                    }`}
                  />
                  {fieldErrors.username && <p className="text-red-400 text-xs mt-1">{fieldErrors.username}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className={`w-full px-4 py-2 pr-12 rounded-lg sm:rounded-xl bg-[#1b2738] placeholder-gray-400 text-white focus:outline-none focus:ring-2 border transition shadow-inner ${
                        fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-[#2a3b4e] focus:ring-cyan-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-300 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {fieldErrors.password ? (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Must contain uppercase, lowercase, number, and special character
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm text-gray-300 mb-1">Account Type</label>
                    <select
                      name="isAdmin"
                      value={formData.isAdmin ? 'admin' : 'user'}
                      onChange={(e) => setFormData({...formData, isAdmin: e.target.value === 'admin'})}
                      className="w-full px-4 py-2 rounded-lg sm:rounded-xl bg-[#1b2738] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-[#2a3b4e] transition shadow-inner"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm text-gray-300 mb-1">Mobile No.</label>
                    <div className="flex">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="w-1/4 px-2 py-2 rounded-l-lg sm:rounded-l-xl bg-[#1b2738] text-white border border-r-0 border-[#2a3b4e] focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+91">+91</option>
                        <option value="+61">+61</option>
                      </select>
                      <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="1234567890"
                        className={`w-full px-4 py-2 rounded-r-lg sm:rounded-r-xl bg-[#1b2738] placeholder-gray-400 text-white focus:outline-none focus:ring-2 border border-l-0 transition shadow-inner ${
                          fieldErrors.mobile ? 'border-red-500 focus:ring-red-500' : 'border-[#2a3b4e] focus:ring-cyan-500'
                        }`}
                      />
                    </div>
                    {fieldErrors.mobile && <p className="text-red-400 text-xs mt-1">{fieldErrors.mobile}</p>}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-2 py-2 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold text-white shadow-md transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-[#17233e] hover:bg-[#223354] border border-[#2a3c5b]'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Sign Up'
                  )}
                </motion.button>

                <p className="text-center text-sm mt-2 text-gray-400">
                  Already have an account?{' '}
                  <NavLink 
                    to="/login" 
                    className="text-cyan-400 hover:underline hover:text-white transition"
                  >
                    Log in
                  </NavLink>
                </p>
              </div>
            </motion.div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;