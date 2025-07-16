import React, { useState } from "react";
import axios from "axios";

import {
  LayoutDashboard, Users, Settings, Shield, CreditCard, BarChart2,
  Lock, Layers, Plus, Download, MoreVertical, Search, Edit, Trash2, 
  Eye, UserPlus, RefreshCw, ChevronDown, Star, Bell, TrendingUp,
  TrendingDown, ArrowUpRight, ArrowDownRight, Activity, CandlestickChart,
  LineChart as LineChartIcon, PieChart as PieChartIcon
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import AfterLoginHeader from "../componants/AfterLoginHeader";
import AllPageFooter from '../componants/AllPageFooter';
import { useAuth } from "../context/AuthContext";

// ========== NEW COMPONENTS ========== //

const MarketIndices = () => {
  const indices = [
    { name: "NIFTY 50", value: "22,326.90", change: "+1.21%", volume: "45.2M" },
    { name: "SENSEX", value: "73,872.29", change: "+1.05%", volume: "38.7M" },
    { name: "NIFTY BANK", value: "47,901.15", change: "+1.89%", volume: "28.3M" },
  ];

  return (
    <div className="bg-[#101B33] p-6 rounded-xl border border-[#1b2e50] shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Market Indices</h3>
        <div className="flex items-center gap-2">
          <select className="bg-[#1E2A4A] text-blue-300 text-sm rounded-md px-3 py-1 focus:outline-none">
            <option>Live</option>
            <option>1D</option>
            <option>1W</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indices.map((index, i) => (
          <div key={i} className="p-4 rounded-lg border border-[#1b2e50] bg-[#0F1A30] hover:border-blue-500 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{index.name}</h4>
                <p className="text-2xl font-bold my-2">{index.value}</p>
                <div className="flex items-center">
                  {index.change.startsWith('+') ? 
                    <ArrowUpRight size={16} className="text-green-400 mr-1" /> : 
                    <ArrowDownRight size={16} className="text-red-400 mr-1" />}
                  <span className={`text-sm ${index.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {index.change}
                  </span>
                </div>
              </div>
              <div className="text-gray-400 text-xs">Vol: {index.volume}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StockPerformance = () => {
  const [activeTab, setActiveTab] = useState('gainers');
  
  const stocks = {
    gainers: [
      { symbol: "RELIANCE", name: "Reliance Industries", price: "₹2,856.90", change: "+3.21%", volume: "12.5M" },
      { symbol: "HDFCBANK", name: "HDFC Bank", price: "₹1,487.25", change: "+2.89%", volume: "8.7M" },
      { symbol: "INFY", name: "Infosys", price: "₹1,532.40", change: "+2.45%", volume: "6.3M" },
    ],
    losers: [
      { symbol: "TATASTEEL", name: "Tata Steel", price: "₹142.35", change: "-2.15%", volume: "15.2M" },
      { symbol: "ITC", name: "ITC Ltd", price: "₹412.80", change: "-1.89%", volume: "9.8M" },
      { symbol: "BHARTIARTL", name: "Bharti Airtel", price: "₹1,156.75", change: "-1.45%", volume: "7.1M" },
    ],
    active: [
      { symbol: "TATAMOTORS", name: "Tata Motors", price: "₹985.60", change: "+1.25%", volume: "18.3M" },
      { symbol: "ICICIBANK", name: "ICICI Bank", price: "₹1,102.40", change: "+0.89%", volume: "14.7M" },
      { symbol: "SBIN", name: "SBI", price: "₹756.30", change: "-0.45%", volume: "12.9M" },
    ]
  };

  return (
    <div className="bg-[#101B33] p-6 rounded-xl border border-[#1b2e50] shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Stock Performance</h3>
        <div className="flex bg-[#1E2A4A] rounded-lg p-1">
          {['gainers', 'losers', 'active'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-sm rounded-md capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-blue-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {stocks[activeTab].map((stock, i) => (
          <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-[#1b2e50] bg-[#0F1A30] hover:bg-[#1B213A] transition-colors">
            <div>
              <h4 className="font-medium">{stock.symbol}</h4>
              <p className="text-gray-400 text-xs">{stock.name}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{stock.price}</p>
              <div className="flex items-center justify-end">
                {stock.change.startsWith('+') ? 
                  <ArrowUpRight size={14} className="text-green-400 mr-1" /> : 
                  <ArrowDownRight size={14} className="text-red-400 mr-1" />}
                <span className={`text-xs ${stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {stock.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SectorAnalysis = () => {
  const sectorData = [
    { name: "IT", value: 78, change: "+2.1%" },
    { name: "Banking", value: 65, change: "+1.4%" },
    { name: "Auto", value: 42, change: "-0.8%" },
    { name: "Pharma", value: 56, change: "+0.9%" },
    { name: "FMCG", value: 34, change: "-1.2%" },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="bg-[#101B33] p-6 rounded-xl border border-[#1b2e50] shadow-md">
      <h3 className="text-xl font-semibold mb-4">Sector Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#101B33', 
                  borderColor: '#1b2e50',
                  borderRadius: '0.5rem'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4">
          {sectorData.map((sector, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="font-medium">{sector.name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2">{sector.value}%</span>
                <span className={`text-xs ${sector.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {sector.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdvancedMarketChart = () => {
  const data = [
    { date: 'Jan', open: 4000, high: 4200, low: 3800, close: 4100 },
    { date: 'Feb', open: 4100, high: 4300, low: 4000, close: 4250 },
    { date: 'Mar', open: 4250, high: 4400, low: 4150, close: 4350 },
    { date: 'Apr', open: 4350, high: 4500, low: 4250, close: 4450 },
    { date: 'May', open: 4450, high: 4600, low: 4350, close: 4550 },
    { date: 'Jun', open: 4550, high: 4700, low: 4450, close: 4650 },
  ];

  const [chartType, setChartType] = useState('line');

  return (
    <div className="bg-[#101B33] p-6 rounded-xl border border-[#1b2e50] shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Market Trends</h3>
        <div className="flex bg-[#1E2A4A] rounded-lg p-1">
          {['line', 'area', 'bar'].map((type) => (
            <button 
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1 text-sm rounded-md capitalize ${chartType === type ? 'bg-blue-600 text-white' : 'text-blue-300'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b2e50" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#101B33', 
                  borderColor: '#1b2e50',
                  borderRadius: '0.5rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#00BFFF" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          ) : chartType === 'area' ? (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b2e50" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#101B33', 
                  borderColor: '#1b2e50',
                  borderRadius: '0.5rem'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="close" 
                stroke="#00BFFF" 
                fill="#00BFFF" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1b2e50" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#101B33', 
                  borderColor: '#1b2e50',
                  borderRadius: '0.5rem'
                }}
              />
              <Bar 
                dataKey="close" 
                fill="#00BFFF" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ========== EXISTING COMPONENTS (UNCHANGED) ========== //

const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-400 border-b border-[#1b2e50]">
          <tr>
            <th className="p-3">User ID</th>
            <th className="p-3">User</th>
            <th className="p-3">Status</th>
            <th className="p-3">Plan</th>
            <th className="p-3">Registered</th>
            <th className="p-3">Last Login</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UserRow = ({ user, onEdit, onDelete }) => (
  <tr className="border-b border-[#1b2e50] hover:bg-[#1B213A] transition-colors">
    <td className="p-3">{user.id}</td>
    <td className="p-3 flex items-center gap-3">
      <UserAvatar name={user.name} />
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-gray-400 text-xs">{user.email}</p>
      </div>
    </td>
    <td className="p-3">
      <StatusBadge status={user.status} />
    </td>
    <td className="p-3">
      <PlanBadge plan={user.plan} />
    </td>
    <td className="p-3">{user.registered}</td>
    <td className="p-3">{user.lastLogin}</td>
    <td className="p-3 flex gap-3">
      <ActionButton icon={<Edit size={16} />} color="blue" onClick={() => onEdit(user)} title="Edit" />
      <ActionButton icon={<Trash2 size={16} />} color="red" onClick={() => onDelete(user.id)} title="Delete" />
    </td>
  </tr>
);

const UserAvatar = ({ name }) => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-sm font-bold">
    {name[0]}
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs ${
    status === "Active" ? "bg-green-800/50 text-green-300" : "bg-[#1E2A4A] text-gray-300"
  }`}>
    {status}
  </span>
);

const PlanBadge = ({ plan }) => (
  <span className={`px-2 py-1 rounded text-xs ${
    plan === "Premium" ? "bg-purple-800/50 text-purple-300" : 
    plan === "Standard" ? "bg-blue-800/50 text-blue-300" : "bg-[#1E2A4A] text-gray-300"
  }`}>
    {plan}
  </span>
);

const ActionButton = ({ icon, color, onClick, title }) => (
  <button 
    onClick={onClick}
    className={`p-1.5 bg-${color}-900/30 hover:bg-${color}-900/50 rounded transition-colors`}
    title={title}
  >
    {React.cloneElement(icon, { className: `text-${color}-400` })}
  </button>
);

const StatsOverview = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {stats.map((stat, index) => (
      <StatCard key={index} {...stat} />
    ))}
  </div>
);

const StatCard = ({ title, value, change, color }) => (
  <div className="bg-[#101B33] p-6 rounded-xl border border-[#1b2e50] shadow-md hover:border-blue-500 transition-colors">
    <h4 className="text-gray-400 text-sm mb-2">{title}</h4>
    <p className="text-2xl font-bold mb-1">{value}</p>
    <p className={`${color} text-sm`}>{change}</p>
  </div>
);

const UserGrowthChart = () => {
  const data = [
    { month: 'Jan', users: 300 },
    { month: 'Feb', users: 600 },
    { month: 'Mar', users: 800 },
    { month: 'Apr', users: 1200 },
    { month: 'May', users: 1500 },
    { month: 'Jun', users: 1800 },
    { month: 'Jul', users: 2100 },
  ];

  return (
    <div className="bg-[#101B33] p-6 rounded-xl border border-[#1b2e50] shadow-md">
      <h4 className="text-xl font-semibold mb-4">User Growth</h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid stroke="#1b2e50" strokeDasharray="5 5" />
          <XAxis dataKey="month" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#101B33', 
              borderColor: '#1b2e50',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#00BFFF" 
            strokeWidth={3} 
            dot={{ r: 4 }} 
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const UserModal = ({ isEditing, show, onClose, onSubmit, user, onChange }) => (
  show && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#101B33] rounded-xl p-6 w-full max-w-md border border-[#1b2e50] shadow-xl">
        <h3 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit User" : "Add New User"}
        </h3>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <FormField 
              label="Name"
              name="name"
              value={user.name}
              onChange={onChange}
              type="text"
              required
            />
            <FormField 
              label="Email"
              name="email"
              value={user.email}
              onChange={onChange}
              type="email"
              required
            />
            <FormSelect 
              label="Status"
              name="status"
              value={user.status}
              onChange={onChange}
              options={["Active", "Inactive"]}
            />
            <FormSelect 
              label="Plan"
              name="plan"
              value={user.plan}
              onChange={onChange}
              options={["Free", "Standard", "Premium"]}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {isEditing ? "Update User" : "Add User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
);

const FormField = ({ label, name, value, onChange, type, required }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 rounded bg-[#0F1A30] text-white border border-[#1b2e50] focus:outline-none focus:ring-2 focus:ring-blue-500"
      required={required}
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 rounded bg-[#0F1A30] text-white border border-[#1b2e50] focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const Button = ({ children, type, onClick, variant = "primary" }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      variant === "primary" 
        ? "bg-blue-600 hover:bg-blue-700 text-white" 
        : "bg-[#1E2A4A] hover:bg-[#2A3F5F] text-blue-300"
    }`}
  >
    {children}
  </button>
);

const UserSearch = ({ value, onChange, onAdd, onReset }) => (
  <div className="flex items-center gap-3">
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search User..."
        className="pl-10 pr-4 py-2 rounded bg-[#0F1A30] text-white border border-[#1b2e50] focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <Button onClick={onAdd} variant="primary">
      <UserPlus size={16} className="mr-1" /> Add User
    </Button>
    <Button onClick={onReset} variant="secondary">
      <RefreshCw size={16} className="mr-1" /> Reset
    </Button>
  </div>
);

// Main AdminDashboard Component
const AdminDashboard = () => {
  const { isLoggedIn } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(sampleUsers);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    status: "Active",
    plan: "Free"
  });

  const handleDelete = async (id) => {
  try {
    await axios.delete(`/api/admin/users/${id}`);
    setUsers(prev => prev.filter(user => user._id !== id));
  } catch (error) {
    console.error("Delete failed:", error);
  }
};


  const handleEdit = (user) => {
    setCurrentUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      status: user.status,
      plan: user.plan
    });
    setIsEditing(true);
    setShowUserModal(true);
  };

  const handleAddUser = () => {
    setIsEditing(false);
    setCurrentUser(null);
    setNewUser({
      name: "",
      email: "",
      status: "Active",
      plan: "Free"
    });
    setShowUserModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isEditing && currentUser) {
      const response = await axios.put(`/api/admin/users/${currentUser._id}`, newUser);
      setUsers(prev => prev.map(user =>
        user._id === currentUser._id ? response.data : user
      ));
    } else {
      const response = await axios.post("/api/admin/users", newUser);
      setUsers(prev => [response.data, ...prev]);
    }
    setShowUserModal(false);
  } catch (error) {
    console.error("Error saving user:", error);
  }
};

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A1428] text-white font-sans">
      {isLoggedIn ? <AfterLoginHeader /> : <Header />}

      <div className="flex">
        <aside className="w-[220px] bg-[#121c31] h-screen p-4 space-y-4 sticky top-0">
          {["Dashboard", "User", "Market", "Analytics", "Content", "Security", "Billing", "Reports", "Settings"].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 hover:bg-[#1B213A] rounded cursor-pointer transition-colors">
              {React.createElement([
                LayoutDashboard, Users, Activity, BarChart2, Layers, Shield, CreditCard, CandlestickChart, Settings
              ][idx], { size: 18 })}
              <span>{item}</span>
            </div>
          ))}
        </aside>

        <main className="flex-1 p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold mb-2">
              Admin <span className="text-blue-400">Dashboard</span>
            </h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
              <Bell size={16} className="mr-2" />
              Notifications
            </button>
          </div>

          {/* New Market Components */}
          <MarketIndices />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StockPerformance />
            <SectorAnalysis />
          </div>
          <AdvancedMarketChart />

          {/* Existing Components */}
          <StatsOverview stats={statsData} />
          <UserGrowthChart />
          
          <div className="bg-[#101B33] p-6 rounded-xl border border-[#1b2e50] shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold">User Management</h4>
              <UserSearch 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onAdd={handleAddUser}
                onReset={() => setUsers(sampleUsers)}
              />
            </div>
            
            <UserTable 
              users={filteredUsers}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            
            <p className="text-xs text-gray-400 mt-4">
              Showing {filteredUsers.length} of {users.length} entries
              {searchTerm && ` (filtered from ${users.length} total entries)`}
            </p>
          </div>
        </main>
      </div>

      <UserModal
        isEditing={isEditing}
        show={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSubmit={handleSubmit}
        user={newUser}
        onChange={handleInputChange}
      />

      <AllPageFooter/>
    </div>
  );
};

// Sample Data
const sampleUsers = [
  { id: 1001, name: "Sneh Patel", email: "snehpatel@gmail.com", status: "Active", plan: "Premium", registered: "May 10, 2025", lastLogin: "May 26, 2025" },
  { id: 1002, name: "Diya Mehta", email: "diya@gmail.com", status: "Inactive", plan: "Standard", registered: "May 8, 2025", lastLogin: "May 25, 2025" },
  { id: 1003, name: "Jay Shah", email: "jay.shah@gmail.com", status: "Active", plan: "Premium", registered: "May 5, 2025", lastLogin: "May 26, 2025" },
  { id: 1004, name: "Aarav Singh", email: "aarav@gmail.com", status: "Active", plan: "Free", registered: "May 2, 2025", lastLogin: "May 24, 2025" },
  { id: 1005, name: "Isha Rani", email: "isha@gmail.com", status: "Inactive", plan: "Premium", registered: "Apr 30, 2025", lastLogin: "May 22, 2025" },
  { id: 1006, name: "Rohan Verma", email: "rohanv@gmail.com", status: "Active", plan: "Standard", registered: "Apr 25, 2025", lastLogin: "May 20, 2025" },
  { id: 1007, name: "Meera Khan", email: "meerak@gmail.com", status: "Active", plan: "Premium", registered: "Apr 20, 2025", lastLogin: "May 18, 2025" },
  { id: 1008, name: "Dev Joshi", email: "devj@gmail.com", status: "Inactive", plan: "Free", registered: "Apr 15, 2025", lastLogin: "May 16, 2025" },
];

const statsData = [
  {
    title: "Total Users",
    value: "12,343",
    change: "+90 (30 days)",
    color: "text-green-400",
  },
  {
    title: "Active Subscriptions",
    value: "8,430",
    change: "+46 (30 days)",
    color: "text-green-400",
  },
  {
    title: "Monthly Revenue",
    value: "₹82,343",
    change: "+12.5% (30 days)",
    color: "text-green-400",
  },
];

export default AdminDashboard;