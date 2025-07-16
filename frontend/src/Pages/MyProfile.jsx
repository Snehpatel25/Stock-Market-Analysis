import React, { useState, useEffect } from "react";
import { 
  ChevronDown, Download, Trash2, Bell, Sun, Moon, Check, X, Edit, 
  User, CreditCard, Settings, Lock, Mail, AlertCircle, BarChart2,
  Calendar, Globe, HardDrive, Smartphone, Bookmark, Database, LogOut
} from "lucide-react";
import AllPageFooter from "../componants/AllPageFooter";
import AfterLoginHeader from "../componants/AfterLoginHeader";

const ProfileSettings = () => {
  // State for form data and settings
  const [chartType, setChartType] = useState("Candlestick");
  const [timePeriod, setTimePeriod] = useState("1 Day");
  const [theme, setTheme] = useState("Light");
  const [currency, setCurrency] = useState("INR");
  const [activeTab, setActiveTab] = useState("Profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [billingInfo, setBillingInfo] = useState({
    cardNumber: "•••• •••• •••• 4242",
    expiryDate: "12/25",
    cvv: "•••",
    name: "Sneh Patel",
    address: "123 Main St, Ahmedabad, Gujarat"
  });
  const [showBillingForm, setShowBillingForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Sneh",
    middleName: "Nareshbhai",
    surname: "Patel",
    email: "snehp@gmail.com",
    mobile: "+91931880906",
    bio: "Lorem Ipsum is a placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups. It has been the standard dummy text."
  });
  const [notifications, setNotifications] = useState({
    email: true,
    priceAlerts: true,
    newsAlerts: false,
    marketSummary: true,
    modelPredictions: false,
    appUpdates: true,
    dividendAlerts: false
  });

  // Navigation items with icons
  const navItems = [
    { name: "Profile", icon: User },
    { name: "Billing", icon: CreditCard },
    { name: "Preference", icon: Settings },
    { name: "Security", icon: Lock },
    { name: "Contact", icon: Mail },
    { name: "Notifications", icon: Bell }
  ];

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Handlers
  const toggleNotification = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    // Here you would typically send the data to your backend
    console.log("Saved data:", formData);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    // Handle password change
    console.log("Password change submitted:", passwordData);
    setShowPasswordForm(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    // Handle billing info update
    console.log("Billing info updated:", billingInfo);
    setShowBillingForm(false);
  };

  const handleExportData = () => {
    // Simulate data export
    setIsLoading(true);
    setTimeout(() => {
      alert("Your data export has started. You'll receive an email with download link shortly.");
      setIsLoading(false);
    }, 1500);
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.")) {
      // Handle account deletion
      setIsLoading(true);
      setTimeout(() => {
        alert("Account deletion request received. You'll receive a confirmation email.");
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleLogout = () => {
    // Handle logout
    alert("You have been logged out successfully.");
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-[#0A1428] min-h-screen text-white relative">
        <AfterLoginHeader className='relative z-30'/>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <AllPageFooter className='relative z-10'/>
      </div>
    );
  }

  return (
    <div className="bg-[#0A1428] min-h-screen text-white relative">
      <AfterLoginHeader className='relative z-30'/>
      <div className="py-8 mx-4 sm:mx-6 lg:mx-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Profile & Settings</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Navigation - Responsive for mobile */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-[#101B33] rounded-xl border border-[#1b2e50] p-4 lg:p-5 sticky top-8">
              <h2 className="text-lg font-semibold mb-4 text-blue-400">My Account</h2>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li 
                    key={item.name}
                    onClick={() => setActiveTab(item.name)}
                    className={`py-2 px-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${
                      activeTab === item.name 
                        ? 'bg-[#1E2A4A] text-white' 
                        : 'text-gray-300 hover:bg-[#1E2A4A] hover:text-white'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </li>
                ))}
                <li 
                  onClick={handleLogout}
                  className="py-2 px-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 text-gray-300 hover:bg-red-900/20 hover:text-red-400 mt-4"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content - Conditionally rendered based on active tab */}
          <div className="flex-1 space-y-6">
            {/* Profile Information Section */}
            {activeTab === "Profile" && (
              <section className="bg-[#101B33] rounded-xl border border-[#1b2e50] p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Edit size={16} /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <X size={16} /> Cancel
                      </button>
                      <button 
                        onClick={handleSaveChanges}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Check size={16} /> Save Changes
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                  <div className="relative group">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full h-16 w-16 flex items-center justify-center text-white text-2xl font-bold">
                      {formData.firstName.charAt(0)}
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1.5 hover:bg-blue-700 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {formData.firstName} {formData.surname}
                    </h3>
                    <p className="text-gray-300 text-sm">{formData.email}</p>
                    <span className="inline-block mt-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      Premium member
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full ${isEditing ? 'bg-[#0F1A30]' : 'bg-[#0F1A30]/50'} border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Middle Name</label>
                    <input 
                      type="text" 
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full ${isEditing ? 'bg-[#0F1A30]' : 'bg-[#0F1A30]/50'} border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Surname</label>
                    <input 
                      type="text" 
                      name="surname"
                      value={formData.surname}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full ${isEditing ? 'bg-[#0F1A30]' : 'bg-[#0F1A30]/50'} border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full ${isEditing ? 'bg-[#0F1A30]' : 'bg-[#0F1A30]/50'} border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Mobile No.</label>
                    <input 
                      type="tel" 
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full ${isEditing ? 'bg-[#0F1A30]' : 'bg-[#0F1A30]/50'} border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500`}
                    />
                  </div>
                  <div className="md:col-span-2 lg:col-span-1">
                    <label className="block text-sm text-gray-400 mb-1">Account Type</label>
                    <select 
                      disabled={!isEditing}
                      className={`w-full ${isEditing ? 'bg-[#0F1A30]' : 'bg-[#0F1A30]/50'} border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500`}
                    >
                      <option>Individual Investor</option>
                      <option disabled>Institutional Investor</option>
                      <option disabled>Analyst</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-1">Bio</label>
                  <textarea 
                    rows="4"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full ${isEditing ? 'bg-[#0F1A30]' : 'bg-[#0F1A30]/50'} border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500`}
                  />
                </div>

                {/* Connected Accounts */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Connected Accounts</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F1A30]">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#1E2A4A] p-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#4285F4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Google</h4>
                          <p className="text-sm text-gray-400">Connected for authentication</p>
                        </div>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                        Disconnect
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#0F1A30]">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#1E2A4A] p-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium">Facebook</h4>
                          <p className="text-sm text-gray-400">Not connected</p>
                        </div>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm font-medium">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Billing Information Section */}
            {activeTab === "Billing" && (
              <section className="bg-[#101B33] rounded-xl border border-[#1b2e50] p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <h2 className="text-xl font-semibold">Billing Information</h2>
                  <button 
                    onClick={() => setShowBillingForm(!showBillingForm)}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {showBillingForm ? <X size={16} /> : <Edit size={16} />}
                    {showBillingForm ? "Cancel" : "Edit Billing"}
                  </button>
                </div>

                {!showBillingForm ? (
                  <div className="space-y-6">
                    <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-blue-400" />
                          Payment Method
                        </h3>
                        <span className="text-sm bg-green-900/30 text-green-400 px-2 py-1 rounded">Active</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 32 24" fill="none">
                            <rect width="32" height="24" rx="3" fill="#1A1F71"/>
                            <path d="M22.5 6H9.5C8.11929 6 7 7.11929 7 8.5V15.5C7 16.8807 8.11929 18 9.5 18H22.5C23.8807 18 25 16.8807 25 15.5V8.5C25 7.11929 23.8807 6 22.5 6Z" fill="white"/>
                            <path d="M13 12C13 10.3431 14.3431 9 16 9C17.6569 9 19 10.3431 19 12C19 13.6569 17.6569 15 16 15C14.3431 15 13 13.6569 13 12Z" fill="#EB001B"/>
                            <path d="M23 12C23 10.3431 21.6569 9 20 9C18.3431 9 17 10.3431 17 12C17 13.6569 18.3431 15 20 15C21.6569 15 23 13.6569 23 12Z" fill="#F79E1B"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-gray-400">Expires {billingInfo.expiryDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                        <h3 className="font-medium flex items-center gap-2 mb-4">
                          <User className="h-5 w-5 text-blue-400" />
                          Billing Details
                        </h3>
                        <div className="space-y-2">
                          <p className="font-medium">{billingInfo.name}</p>
                          <p className="text-sm text-gray-400">{billingInfo.address}</p>
                        </div>
                      </div>

                      <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                        <h3 className="font-medium flex items-center gap-2 mb-4">
                          <BarChart2 className="h-5 w-5 text-blue-400" />
                          Subscription Plan
                        </h3>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Premium Plan</p>
                            <p className="text-sm text-gray-400">Next billing: Jan 15, 2024</p>
                          </div>
                          <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">₹999/month</span>
                        </div>
                        <button className="mt-4 w-full bg-[#1E2A4A] hover:bg-[#27375E] text-blue-300 px-4 py-2 rounded-lg transition-colors">
                          Change Plan
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                      <h3 className="font-medium flex items-center gap-2 mb-4">
                        <Database className="h-5 w-5 text-blue-400" />
                        Billing History
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-sm text-gray-400 border-b border-[#1b2e50]">
                              <th className="pb-3">Date</th>
                              <th className="pb-3">Description</th>
                              <th className="pb-3">Amount</th>
                              <th className="pb-3">Status</th>
                              <th className="pb-3"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { date: "Dec 15, 2023", desc: "Premium Subscription", amount: "₹999", status: "Paid" },
                              { date: "Nov 15, 2023", desc: "Premium Subscription", amount: "₹999", status: "Paid" },
                              { date: "Oct 15, 2023", desc: "Premium Subscription", amount: "₹999", status: "Paid" }
                            ].map((item, index) => (
                              <tr key={index} className="border-b border-[#1b2e50]">
                                <td className="py-3 text-sm">{item.date}</td>
                                <td className="py-3 text-sm">{item.desc}</td>
                                <td className="py-3 text-sm">{item.amount}</td>
                                <td className="py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    item.status === "Paid" 
                                      ? "bg-green-900/30 text-green-400" 
                                      : "bg-yellow-900/30 text-yellow-400"
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="py-3 text-right">
                                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                                    Download
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBillingSubmit} className="space-y-6">
                    <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                      <h3 className="font-medium mb-4">Payment Method</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                          <input 
                            type="text" 
                            name="cardNumber"
                            value={billingInfo.cardNumber}
                            onChange={handleBillingChange}
                            placeholder="1234 5678 9012 3456"
                            className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
                            <input 
                              type="text" 
                              name="expiryDate"
                              value={billingInfo.expiryDate}
                              onChange={handleBillingChange}
                              placeholder="MM/YY"
                              className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">CVV</label>
                            <input 
                              type="text" 
                              name="cvv"
                              value={billingInfo.cvv}
                              onChange={handleBillingChange}
                              placeholder="•••"
                              className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Name on Card</label>
                          <input 
                            type="text" 
                            name="name"
                            value={billingInfo.name}
                            onChange={handleBillingChange}
                            className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                      <h3 className="font-medium mb-4">Billing Address</h3>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Address</label>
                        <textarea 
                          rows="3"
                          name="address"
                          value={billingInfo.address}
                          onChange={handleBillingChange}
                          className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button 
                        type="button"
                        onClick={() => setShowBillingForm(false)}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </section>
            )}

            {/* Preferences Section */}
            {activeTab === "Preference" && (
              <section className="bg-[#101B33] rounded-xl border border-[#1b2e50] p-5 sm:p-6">
                <h2 className="text-xl font-semibold mb-6">Preferences</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Default Chart Type</label>
                    <div className="relative">
                      <select 
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-blue-500"
                      >
                        <option>Candlestick</option>
                        <option>Line</option>
                        <option>Bar</option>
                        <option>Area</option>
                        <option>Heikin Ashi</option>
                        <option>Renko</option>
                        <option>Point & Figure</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Default Time Period</label>
                    <div className="relative">
                      <select 
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-blue-500"
                      >
                        <option>1 Day</option>
                        <option>1 Week</option>
                        <option>1 Month</option>
                        <option>3 Months</option>
                        <option>6 Months</option>
                        <option>1 Year</option>
                        <option>5 Years</option>
                        <option>All Time</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Theme</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTheme("Light")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border ${
                          theme === "Light" 
                            ? "bg-[#1E2A4A] border-blue-400 text-blue-400" 
                            : "border-[#27354a] text-gray-400 hover:bg-[#1E2A4A]/50"
                        } transition-colors`}
                      >
                        <Sun className="h-4 w-4" /> Light
                      </button>
                      <button
                        onClick={() => setTheme("Dark")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border ${
                          theme === "Dark" 
                            ? "bg-[#1E2A4A] border-blue-400 text-blue-400" 
                            : "border-[#27354a] text-gray-400 hover:bg-[#1E2A4A]/50"
                        } transition-colors`}
                      >
                        <Moon className="h-4 w-4" /> Dark
                      </button>
                      <button
                        onClick={() => setTheme("System")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md border ${
                          theme === "System" 
                            ? "bg-[#1E2A4A] border-blue-400 text-blue-400" 
                            : "border-[#27354a] text-gray-400 hover:bg-[#1E2A4A]/50"
                        } transition-colors`}
                      >
                        <Settings className="h-4 w-4" /> System
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Currency</label>
                    <div className="relative">
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-blue-500"
                      >
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>JPY (¥)</option>
                        <option>AUD (A$)</option>
                        <option>CAD (C$)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Default Watchlist</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-blue-500"
                      >
                        <option>My Watchlist</option>
                        <option>Top Gainers</option>
                        <option>Top Losers</option>
                        <option>Most Active</option>
                        <option>Tech Stocks</option>
                        <option>Banking Sector</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-2">Data Refresh Rate</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-blue-500"
                      >
                        <option>Real-time (15 sec delay)</option>
                        <option>1 Minute</option>
                        <option>5 Minutes</option>
                        <option>15 Minutes</option>
                        <option>30 Minutes</option>
                        <option>Manual Refresh</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Security Section */}
            {activeTab === "Security" && (
              <section className="bg-[#101B33] rounded-xl border border-[#1b2e50] p-5 sm:p-6">
                <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          <Lock className="h-5 w-5 text-blue-400" />
                          Password
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          Last changed 3 months ago
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        {showPasswordForm ? <X size={16} /> : <Edit size={16} />}
                        {showPasswordForm ? "Cancel" : "Change Password"}
                      </button>
                    </div>

                    {showPasswordForm && (
                      <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                          <input 
                            type="password" 
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">New Password</label>
                          <input 
                            type="password" 
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Password must be at least 8 characters long and contain a mix of letters, numbers, and symbols.
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                          <input 
                            type="password" 
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                          <button 
                            type="button"
                            onClick={() => setShowPasswordForm(false)}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Update Password
                          </button>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                    <h3 className="font-medium flex items-center gap-2 mb-4">
                      <Smartphone className="h-5 w-5 text-blue-400" />
                      Two-Factor Authentication
                    </h3>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <p className="text-sm text-gray-400">
                          Add an extra layer of security to your account by enabling two-factor authentication.
                        </p>
                      </div>
                      <button className="bg-[#1E2A4A] hover:bg-[#27375E] text-blue-300 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                    <h3 className="font-medium flex items-center gap-2 mb-4">
                      <HardDrive className="h-5 w-5 text-blue-400" />
                      Active Sessions
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-[#1E2A4A]/20">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#1E2A4A] p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                              <line x1="8" y1="21" x2="16" y2="21"></line>
                              <line x1="12" y1="17" x2="12" y2="21"></line>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Windows 10 • Chrome</p>
                            <p className="text-sm text-gray-400">Ahmedabad, India • Active now</p>
                          </div>
                        </div>
                        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                          Logout
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-[#1E2A4A]/20">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#1E2A4A] p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">iPhone 13 • Safari</p>
                            <p className="text-sm text-gray-400">Mumbai, India • 2 hours ago</p>
                          </div>
                        </div>
                        <button className="text-red-400 hover:text-red-300 text-sm font-medium">
                          Logout
                        </button>
                      </div>
                    </div>
                    <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium">
                      View all active sessions
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Contact Section */}
            {activeTab === "Contact" && (
              <section className="bg-[#101B33] rounded-xl border border-[#1b2e50] p-5 sm:p-6">
                <h2 className="text-xl font-semibold mb-6">Contact & Support</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                    <h3 className="font-medium flex items-center gap-2 mb-4">
                      <Mail className="h-5 w-5 text-blue-400" />
                      Contact Us
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Have questions or need assistance? Our support team is here to help.
                    </p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Send Message
                    </button>
                  </div>

                  <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                    <h3 className="font-medium flex items-center gap-2 mb-4">
                      <AlertCircle className="h-5 w-5 text-blue-400" />
                      Help Center
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Browse our knowledge base for answers to common questions.
                    </p>
                    <button className="w-full bg-[#1E2A4A] hover:bg-[#27375E] text-blue-300 px-4 py-2 rounded-lg transition-colors">
                      Visit Help Center
                    </button>
                  </div>
                </div>

                <div className="bg-[#0F1A30] rounded-xl p-5 border border-[#1b2e50]">
                  <h3 className="font-medium flex items-center gap-2 mb-4">
                    <Bookmark className="h-5 w-5 text-blue-400" />
                    Feedback
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    We'd love to hear your feedback about our platform. What can we improve?
                  </p>
                  <textarea 
                    rows="4"
                    placeholder="Your feedback..."
                    className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 mb-4"
                  />
                  <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Submit Feedback
                  </button>
                </div>
              </section>
            )}

            {/* Notification Settings Section */}
            {(activeTab === "Notifications" || activeTab === "Settings") && (
              <section className="bg-[#101B33] rounded-xl border border-[#1b2e50] p-5 sm:p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>
                
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1E2A4A]/50 transition-colors">
                      <div>
                        <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        <p className="text-sm text-gray-400">
                          {key === "email" && "Receive important updates and alerts via email"}
                          {key === "priceAlerts" && "Get notified when stocks in your watchlist hit target prices"}
                          {key === "newsAlerts" && "Receive news updates about companies in your portfolio"}
                          {key === "marketSummary" && "Daily summary of market performance"}
                          {key === "modelPredictions" && "Get notified when ML models generate new predictions"}
                          {key === "appUpdates" && "Receive notifications about new app features and updates"}
                          {key === "dividendAlerts" && "Get alerts when dividend payments are processed"}
                        </p>
                      </div>
                      <button 
                        onClick={() => toggleNotification(key)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                          value ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`${
                            value ? 'translate-x-6' : 'translate-x-1'
                          } inline-block w-4 h-4 transform transition-transform bg-white rounded-full`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="font-medium mb-4">Notification Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email Frequency</label>
                      <div className="relative">
                        <select 
                          className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-blue-500"
                        >
                          <option>Real-time</option>
                          <option>Daily Digest</option>
                          <option>Weekly Summary</option>
                          <option>Important Only</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Push Notification Sound</label>
                      <div className="relative">
                        <select 
                          className="w-full bg-[#0F1A30] border border-[#27354a] rounded-md px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-blue-500"
                        >
                          <option>Default</option>
                          <option>Chime</option>
                          <option>Bell</option>
                          <option>None</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Danger Zone Section - Visible on all tabs except Billing */}
            {activeTab !== "Billing" && (
              <section className="bg-[#101B33] rounded-xl border-2 border-red-900/50 p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-red-400 mb-6">Danger Zone</h2>
                
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-[#1E2A4A]/50">
                    <div className="mb-3 md:mb-0">
                      <h3 className="font-medium flex items-center gap-2">
                        <Download className="h-4 w-4 text-blue-400" />
                        Export All Data
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Download a copy of all your data including portfolio, watchlists, and settings
                      </p>
                    </div>
                    <button 
                      onClick={handleExportData}
                      className="bg-[#1E2A4A] hover:bg-[#27375E] text-blue-300 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Export Data
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-[#1E2A4A]/50 border-t border-[#27354a]">
                    <div className="mb-3 md:mb-0">
                      <h3 className="font-medium flex items-center gap-2">
                        <Trash2 className="h-4 w-4 text-red-400" />
                        Delete Account
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <button 
                      className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                      onClick={handleDeleteAccount}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      <AllPageFooter className='relative z-10'/>
    </div>
  );
};

export default ProfileSettings;