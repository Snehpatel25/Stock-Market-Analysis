import React, { useState, useEffect } from "react";
import {
  ChevronDown, Star, TrendingUp, TrendingDown, RefreshCw, 
  Bell, Plus, CandlestickChart, LineChart as LineChartIcon,
  PieChart as PieChartIcon, BarChart2, AlertTriangle,
  Clock, Calendar, Filter, ArrowRight, ArrowLeft,
  Wallet, CreditCard, Database, Shield, Settings
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, ScatterChart, Scatter, ZAxis
} from "recharts";
import Header from "../componants/Header";
import Footer from "../componants/Footer";
import AfterLoginHeader from "../componants/AfterLoginHeader";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const RiskAnalyzer = () => {
  const [riskLevel, setRiskLevel] = useState(65);
  const [portfolio, setPortfolio] = useState([
    { name: "Equity", value: 65, color: "#0088FE" },
    { name: "Bonds", value: 20, color: "#00C49F" },
    { name: "Commodities", value: 10, color: "#FFBB28" },
    { name: "Crypto", value: 5, color: "#FF8042" },
  ]);

  return (
    <div className="bg-[#101B33] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#1b2e50] shadow-lg sm:shadow-xl">
      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Portfolio Risk Analyzer</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <span className="text-sm sm:text-base text-gray-400">Risk Level</span>
            <span className={`text-sm sm:text-lg font-bold ${
              riskLevel > 70 ? "text-red-400" : 
              riskLevel > 40 ? "text-yellow-400" : "text-green-400"
            }`}>
              {riskLevel > 70 ? "High" : riskLevel > 40 ? "Medium" : "Low"}
            </span>
          </div>
          <div className="h-2 sm:h-3 bg-[#1b2e50] rounded-full mb-4 sm:mb-6">
            <div 
              className={`h-full rounded-full ${
                riskLevel > 70 ? "bg-red-500" : 
                riskLevel > 40 ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${riskLevel}%` }}
            ></div>
          </div>
          <div className="space-y-2 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1">Diversification</label>
              <div className="h-1 sm:h-2 bg-[#1b2e50] rounded-full">
                <div className="h-full rounded-full bg-blue-500" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1">Volatility</label>
              <div className="h-1 sm:h-2 bg-[#1b2e50] rounded-full">
                <div className="h-full rounded-full bg-purple-500" style={{ width: "62%" }}></div>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1">Liquidity</label>
              <div className="h-1 sm:h-2 bg-[#1b2e50] rounded-full">
                <div className="h-full rounded-full bg-green-500" style={{ width: "85%" }}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={portfolio}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {portfolio.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
      </div>
      <button className="mt-3 sm:mt-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium w-full">
        Optimize Portfolio
      </button>
    </div>
  );
};

const AIStockRecommendations = () => {
  const recommendations = [
    { symbol: "RELIANCE", name: "Reliance Industries", action: "Buy", confidence: 85, price: "₹2,856.90", target: "₹3,100.00" },
    { symbol: "HDFCBANK", name: "HDFC Bank", action: "Hold", confidence: 72, price: "₹1,487.25", target: "₹1,550.00" },
    { symbol: "INFY", name: "Infosys", action: "Strong Buy", confidence: 91, price: "₹1,532.40", target: "₹1,750.00" },
    { symbol: "TATASTEEL", name: "Tata Steel", action: "Sell", confidence: 68, price: "₹142.35", target: "₹130.00" },
  ];

  return (
    <div className="bg-[#101B33] p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#1b2e50] shadow-lg sm:shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <h3 className="text-xl sm:text-2xl font-bold">AI Stock Recommendations</h3>
        <div className="flex items-center gap-2">
          <button className="bg-[#1E2A4A] text-blue-300 px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm flex items-center">
            <Filter size={12} className="mr-1" /> Filter
          </button>
          <button className="bg-[#1E2A4A] text-blue-300 px-2 py-1 sm:px-3 sm:py-1 rounded-md text-xs sm:text-sm flex items-center">
            <RefreshCw size={12} className="mr-1" /> Refresh
          </button>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        {recommendations.map((stock, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.01 }}
            className="p-3 sm:p-4 rounded-lg border border-[#1b2e50] bg-[#0F1A30]"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
              <div>
                <h4 className="font-bold text-sm sm:text-base">{stock.symbol}</h4>
                <p className="text-gray-400 text-xs sm:text-sm">{stock.name}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                stock.action === "Buy" ? "bg-green-900 text-green-300" :
                stock.action === "Strong Buy" ? "bg-green-800 text-green-200" :
                stock.action === "Sell" ? "bg-red-900 text-red-300" :
                "bg-yellow-900 text-yellow-300"
              }`}>
                {stock.action}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <p className="text-xs sm:text-sm">Current: {stock.price}</p>
                <p className="text-xs sm:text-sm">Target: {stock.target}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end">
                  <span className="text-xs text-gray-400 mr-2">Confidence</span>
                  <span className={`text-xs sm:text-sm font-bold ${
                    stock.confidence > 80 ? "text-green-400" :
                    stock.confidence > 60 ? "text-yellow-400" : "text-red-400"
                  }`}>
                    {stock.confidence}%
                  </span>
                </div>
                <div className="h-1 sm:h-2 bg-[#1b2e50] rounded-full mt-1 w-20 sm:w-24">
                  <div 
                    className={`h-full rounded-full ${
                      stock.confidence > 80 ? "bg-green-500" :
                      stock.confidence > 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${stock.confidence}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <button className="mt-3 sm:mt-4 text-blue-300 text-xs sm:text-sm hover:underline flex items-center justify-center w-full">
        View All Recommendations
      </button>
    </div>
  );
};

const Main = () => {
  const [mode, setMode] = useState("Daily");
  const [capType, setCapType] = useState("Large Cap");
  const { isLoggedIn } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [newsExpanded, setNewsExpanded] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(125232.24);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStock, setActiveStock] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [sentiment, setSentiment] = useState({
    status: "Greed",
    value: 72,
    change: "+2"
  });

  const indices = [
    { name: "NIFTY 50", value: "22,326.90", change: "+1.21%", volume: "45.2M" },
    { name: "SENSEX", value: "73,872.29", change: "+1.05%", volume: "38.7M" },
    { name: "NIFTY BANK", value: "47,901.15", change: "+1.89%", volume: "28.3M" },
  ];

  const dailyDays = ["MON", "TUE", "WED", "THU", "FRI", "TODAY"];
  const monthlyDays = ["WEEK 1", "WEEK 2", "WEEK 3", "WEEK 4", "THIS MONTH"];

  const handleModeChange = () => {
    setMode((prev) => (prev === "Daily" ? "Monthly" : "Daily"));
  };

  const stocksData = [
    { name: "NIFTY 50", price: "25,000.10", change: "+0.21%", volume: "12.5M" },
    { name: "SENSEX", price: "82,029.25", change: "+0.18%", volume: "8.2M" },
    { name: "BANK NIFTY", price: "45,210.90", change: "+0.30%", volume: "5.7M" },
    { name: "NIFTY IT", price: "32,004.70", change: "-0.25%", volume: "3.1M" },
    { name: "MIDCAP 100", price: "40,120.80", change: "+0.11%", volume: "4.8M" },
    { name: "NIFTY AUTO", price: "17,021.95", change: "-0.14%", volume: "2.9M" },
  ];

  const featuredAnalysis = [
    { model: "LSTM", result: "+2.3% (7 days)", color: "text-green-400", accuracy: "89%" },
    { model: "GRU", result: "+1.8% (7 days)", color: "text-green-400", accuracy: "87%" },
    { model: "Prophet", result: "+2.1% (7 days)", color: "text-green-400", accuracy: "88%" },
    { model: "Ensemble", result: "+2.6% (7 days)", color: "text-green-400", accuracy: "91%" },
  ];

  const todayStocks = {
    "Large Cap": [
      { name: "Reliance Industries", company: "RELIANCE", price: "₹2,856.90", change: "+3.21%", volume: "12.5M" },
      { name: "HDFC Bank", company: "HDFCBANK", price: "₹1,487.25", change: "+2.89%", volume: "8.7M" },
      { name: "Infosys", company: "INFY", price: "₹1,532.40", change: "+2.45%", volume: "6.3M" },
      { name: "ICICI Bank", company: "ICICIBANK", price: "₹1,102.40", change: "+0.89%", volume: "14.7M" },
      { name: "TCS", company: "TCS", price: "₹3,921.80", change: "+1.05%", volume: "3.5M" },
      { name: "Bharti Airtel", company: "BHARTIARTL", price: "₹1,156.75", change: "-1.45%", volume: "7.1M" },
    ],
    "Mid Cap": [
      { name: "Tata Motors", company: "TATAMOTORS", price: "₹985.60", change: "+1.25%", volume: "18.3M" },
      { name: "L&T Finance", company: "LTFH", price: "₹175.25", change: "+1.95%", volume: "5.1M" },
      { name: "Voltas", company: "VOLTAS", price: "₹1,431.00", change: "+1.21%", volume: "3.9M" },
      { name: "Page Industries", company: "PAGEIND", price: "₹36,850.00", change: "+0.34%", volume: "0.8M" },
      { name: "Indiamart", company: "INDMART", price: "₹2,981.55", change: "+1.42%", volume: "0.7M" },
      { name: "Can Fin Homes", company: "CANFINHOME", price: "₹912.30", change: "+1.25%", volume: "1.5M" },
    ],
    "Small Cap": [
      { name: "Affle India", company: "AFFLE", price: "₹1,252.40", change: "+2.12%", volume: "0.6M" },
      { name: "Angel One", company: "ANGELONE", price: "₹2,022.60", change: "+3.88%", volume: "1.3M" },
      { name: "Tejas Networks", company: "TEJASNET", price: "₹905.15", change: "+2.36%", volume: "1.4M" },
      { name: "Siyaram Silk Mills", company: "SIYSIL", price: "₹628.45", change: "+1.45%", volume: "0.6M" },
      { name: "PTC India", company: "PTC", price: "₹242.10", change: "+0.88%", volume: "1.3M" },
      { name: "KDDL", company: "KDDL", price: "₹1,940.00", change: "+3.21%", volume: "0.5M" },
    ],
  };

  const news = [
    { title: "MASTEK", content: "MASTEK reported Q4 profits up by 12% YoY, beating analyst expectations. The company announced a dividend of ₹8 per share.", type: "up", time: "2h ago" },
    { title: "MARKOBENZ", content: "MARKOBENZ faces regulatory scrutiny over accounting practices. Stock drops 5% in pre-market trading.", type: "down", time: "4h ago" },
    { title: "RBI Policy", content: "RBI keeps repo rate unchanged at 6.5%, maintains 'withdrawal of accommodation' stance.", type: "neutral", time: "6h ago" },
    { title: "Oil Prices", content: "Crude oil prices surge 3% amid Middle East tensions, likely impacting inflation.", type: "up", time: "8h ago" },
  ];

  const toggleFavorite = (company) => {
    if (favorites.includes(company)) {
      setFavorites(favorites.filter(item => item !== company));
    } else {
      setFavorites([...favorites, company]);
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPortfolioValue(prev => prev * (1 + (Math.random() * 0.02 - 0.01)));
      setSentiment(prev => ({
        ...prev,
        value: Math.min(100, Math.max(0, prev.value + (Math.random() * 4 - 2))),
        change: `${Math.random() > 0.5 ? '+' : ''}${(Math.random() * 1.5).toFixed(1)}`
      }));
    }, 1500);
  };

  return (
    <>
      {isLoggedIn ? <AfterLoginHeader /> : <Header />}
      
      <div className="bg-[#0A1428] min-h-screen text-white px-4 sm:px-6 md:px-8 lg:px-16 pt-4 mt-20 sm:pt-6">
        <main className="mt-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2">
                Welcome to <span className="text-blue-400">SP Stock Analysis</span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg">Advanced market intelligence platform</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium flex items-center self-end sm:self-auto">
              <Bell size={14} className="mr-1 sm:mr-2" />
              Alerts
            </button>
          </div>

          {/* Market Overview Section */}
          <div className="w-full text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#1b2e50] bg-[#111D38] mb-6 sm:mb-8">
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              {indices.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-tr from-[#1E2A4A] to-[#27375E] px-3 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg font-semibold shadow-md"
                >
                  <span className="text-xs sm:text-sm text-gray-400 mr-1 sm:mr-2">{item.name}</span>
                  <span className="text-xs sm:text-sm text-white mr-1 sm:mr-2">{item.value}</span>
                  <span className={`text-xs ${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {item.change}
                  </span>
                </motion.div>
              ))}
              <button
                onClick={handleModeChange}
                className="ml-auto flex items-center gap-1 text-blue-300 text-xs sm:text-sm bg-[#1E2A4A] px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors shadow-md"
              >
                <span>{mode}</span>
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">
                Market Sentiment: {" "}
                <span className={`bg-gradient-to-r ${
                  sentiment.value > 70 
                    ? "from-yellow-500 via-orange-500 to-red-600" 
                    : sentiment.value < 30 
                      ? "from-blue-400 to-blue-600" 
                      : "from-green-400 to-green-600"
                } bg-clip-text text-transparent animate-pulse`}>
                  {sentiment.status}
                </span>{" "}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {(mode === "Daily" ? dailyDays : monthlyDays).map((label, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center text-xs text-gray-300"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 shadow-inner ${
                        label === "TODAY" || label === "THIS MONTH"
                          ? "bg-[#1B213A] border-orange-500"
                          : "border-orange-500"
                      } flex items-center justify-center animate-pulse`}
                    >
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 ${
                        label === "TODAY" || label === "THIS MONTH" 
                          ? "bg-orange-500" 
                          : "bg-transparent"
                      } rounded-full`} />
                    </div>
                    <span className="mt-1 font-semibold">{label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            {stocksData.map((stock, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="p-3 sm:p-4 flex justify-between rounded-lg sm:rounded-xl bg-[#101B33] border border-[#1b2e50] shadow-md hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => setActiveStock(stock.name)}
              >
                <div className="w-1/2">
                  <div className="flex items-center">
                    <h3 className="text-xs sm:text-sm text-gray-400">{stock.name}</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(stock.name);
                      }}
                      className={`ml-1 ${favorites.includes(stock.name) ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'}`}
                    >
                      <Star size={12} fill={favorites.includes(stock.name) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <p className="text-white font-bold text-sm sm:text-base md:text-lg">{stock.price}</p>
                  <p
                    className={`text-xs sm:text-sm font-semibold mt-1 ${
                      stock.change.startsWith("-") ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {stock.change.startsWith("+") ? 
                      <TrendingUp size={12} className="inline mr-1" /> : 
                      <TrendingDown size={12} className="inline mr-1" />}
                    {stock.change}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Vol: {stock.volume}</p>
                </div>
                <div className="w-1/2 h-20 sm:h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { value: 20 }, { value: 45 }, { value: 28 }, 
                      { value: 80 }, { value: 99 }, { value: 43 }
                    ]}>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#00BFFF" 
                        fill="#00BFFF" 
                        fillOpacity={0.2}
                        strokeWidth={1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="lg:col-span-2">
              <div className="p-4 sm:p-6 rounded-xl bg-[#101B33] border border-[#1b2e50] shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold">Today's Stocks</h3>
                  <div className="flex items-center gap-2">
                    <select
                      value={capType}
                      onChange={(e) => setCapType(e.target.value)}
                      className="bg-[#1E2A4A] text-blue-300 text-xs sm:text-sm rounded-md px-2 py-1 sm:px-3 sm:py-1 focus:outline-none"
                    >
                      <option>Large Cap</option>
                      <option>Mid Cap</option>
                      <option>Small Cap</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-md">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {todayStocks[capType].map((stock, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="p-2 sm:p-3 rounded-md sm:rounded-lg border border-[#1b2e50] bg-[#0F1A30] hover:border-blue-500 transition-colors cursor-pointer"
                      onClick={() => setActiveStock(stock.company)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-sm sm:text-base">{stock.name}</h4>
                          <span className="text-gray-400 text-xs">{stock.company}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(stock.company);
                          }}
                          className={`ml-1 ${favorites.includes(stock.company) ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-300'}`}
                        >
                          <Star size={12} fill={favorites.includes(stock.company) ? "currentColor" : "none"} />
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-1 sm:mt-2">
                        <div>
                          <p className="text-xs sm:text-sm">{stock.price}</p>
                          <span className={`text-xs ${stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {stock.change}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">Vol: {stock.volume}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 rounded-xl bg-[#101B33] border border-[#1b2e50] shadow-md">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">Today's News</h3>
                <button 
                  onClick={() => setNewsExpanded(!newsExpanded)}
                  className="text-xs sm:text-sm text-blue-300 hover:underline"
                >
                  {newsExpanded ? "Show Less" : "Show More"}
                </button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {news.slice(0, newsExpanded ? news.length : 2).map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="text-xs sm:text-sm border-b border-[#1b2e50] pb-2 sm:pb-3"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className={`font-semibold ${
                        item.type === "up" ? "text-green-400" : 
                        item.type === "down" ? "text-red-400" : "text-blue-400"
                      }`}>
                        {item.title}
                      </h4>
                      <span className="text-gray-400 text-xs">{item.time}</span>
                    </div>
                    <p className="text-gray-300 text-xs mt-1">{item.content}</p>
                  </motion.div>
                ))}
              </div>
              <button className="mt-3 sm:mt-4 text-xs sm:text-sm text-blue-300 hover:underline flex items-center">
                <Bell size={12} className="mr-1" />
                Set News Alerts
              </button>
            </div>
          </div>

          <RiskAnalyzer />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 mt-6 sm:mt-10">
            <div className="lg:col-span-2">
              <div className="p-4 sm:p-6 rounded-xl bg-[#101B33] border border-[#1b2e50] shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 gap-2">
                  <h3 className="text-lg sm:text-xl font-semibold">AI Stock Predictions</h3>
                  <select className="bg-[#1E2A4A] text-blue-300 text-xs sm:text-sm rounded-md px-2 py-1 sm:px-3 sm:py-1 focus:outline-none">
                    <option>7 Days</option>
                    <option>15 Days</option>
                    <option>30 Days</option>
                  </select>
                </div>
                <div className="h-36 sm:h-48 bg-[#0A1428] rounded-md flex items-center justify-center text-gray-500 mb-3 sm:mb-4 border border-[#1b2e50]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { day: 1, lstm: 20, gru: 25, prophet: 22, ensemble: 23 },
                      { day: 2, lstm: 45, gru: 40, prophet: 42, ensemble: 44 },
                      { day: 3, lstm: 28, gru: 30, prophet: 29, ensemble: 30 },
                      { day: 4, lstm: 80, gru: 75, prophet: 78, ensemble: 79 },
                      { day: 5, lstm: 99, gru: 95, prophet: 97, ensemble: 98 },
                      { day: 6, lstm: 43, gru: 50, prophet: 47, ensemble: 48 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1b2e50" />
                      <XAxis dataKey="day" stroke="#ccc" />
                      <YAxis stroke="#ccc" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#101B33', 
                          borderColor: '#1b2e50',
                          borderRadius: '0.5rem'
                        }}
                      />
                      <Line type="monotone" dataKey="lstm" stroke="#8884d8" strokeWidth={1} />
                      <Line type="monotone" dataKey="gru" stroke="#82ca9d" strokeWidth={1} />
                      <Line type="monotone" dataKey="prophet" stroke="#ffc658" strokeWidth={1} />
                      <Line type="monotone" dataKey="ensemble" stroke="#ff8042" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <ul className="space-y-1 sm:space-y-2">
                  {featuredAnalysis.map((item, i) => (
                    <motion.li 
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      className="text-xs sm:text-sm flex justify-between items-center bg-[#0F1A30] px-2 py-1 sm:px-3 sm:py-2 rounded"
                    >
                      <div>
                        <span className="font-medium">{item.model}</span>
                        <span className="text-gray-400 text-xs ml-1 sm:ml-2">Accuracy: {item.accuracy}</span>
                      </div>
                      <span className={item.color}>{item.result}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-4 sm:p-6 rounded-xl bg-[#101B33] border border-[#1b2e50] shadow-md">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-lg sm:text-xl font-semibold">Your Portfolio</h3>
                <button className="text-xs sm:text-sm text-blue-300 hover:underline">View All</button>
              </div>
              <p className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">₹{portfolioValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4">
                <span className="text-green-400 text-xs sm:text-sm">+2.3% Today</span>
                <span className="text-gray-400 text-xs sm:text-sm">|</span>
                <span className="text-green-400 text-xs sm:text-sm">+12.1% YTD</span>
              </div>
              <div className="h-40 sm:h-48 bg-[#0A1428] rounded-md flex items-center justify-center text-gray-500 mb-3 sm:mb-4 border border-[#1b2e50]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Stocks", value: 65 },
                        { name: "Bonds", value: 20 },
                        { name: "Crypto", value: 10 },
                        { name: "Cash", value: 5 },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 50 : 60}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                      <Cell fill="#FFBB28" />
                      <Cell fill="#FF8042" />
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
              <div className="flex flex-col sm:flex-row justify-between gap-2 text-xs sm:text-sm">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg">
                  Add Funds
                </button>
                <button className="bg-[#1E2A4A] hover:bg-[#2A3F5F] text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg">
                  Trade
                </button>
                <button className="bg-[#1E2A4A] hover:bg-[#2A3F5F] text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg">
                  Analyze
                </button>
              </div>
            </div>
          </div>

          <AIStockRecommendations />
        </main>
      </div>
      <div className="mt-8 sm:mt-16">
        <Footer />
      </div>
    </>
  );
};

export default Main;