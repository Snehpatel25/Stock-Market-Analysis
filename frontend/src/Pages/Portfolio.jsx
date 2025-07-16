import React, { useState } from "react";
import {
  Download, Plus, Search, MoreVertical, ChevronDown, Bell, BellOff,
  Settings, RefreshCw, ArrowUp, ArrowDown, PieChart as PieChartIcon,
  LineChart as LineChartIcon, BarChart2, ScatterChart as ScatterChartIcon,
  DollarSign, TrendingUp, Clock, Layers, ChevronRight
} from "lucide-react";
import {
  PieChart,
  LineChart,
  BarChart,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Scatter,
  ComposedChart,
  ReferenceLine,
  ScatterChart,
  Label,
  Sector,
  Area
} from 'recharts';
import AllPageFooter from "../componants/AllPageFooter";
import AfterLoginHeader from "../componants/AfterLoginHeader";

// Enhanced mock data
const initialHoldings = [
  { ticker: "AAPL", name: "Apple Inc.", shares: 100, price: 189.75, value: 18975, cost: 17200, gain: 10.3, allocation: 18.5, sector: "Technology", dividendYield: 0.5 },
  { ticker: "MSFT", name: "Microsoft Corp.", shares: 85, price: 420.69, value: 35758.65, cost: 32000, gain: 11.8, allocation: 34.7, sector: "Technology", dividendYield: 0.8 },
  { ticker: "AMZN", name: "Amazon.com, Inc.", shares: 50, price: 185.25, value: 9262.5, cost: 8500, gain: 8.9, allocation: 8.9, sector: "Consumer", dividendYield: 0.0 },
  { ticker: "GOOGL", name: "Alphabet Inc.", shares: 30, price: 175.50, value: 5265, cost: 4800, gain: 9.7, allocation: 5.0, sector: "Technology", dividendYield: 0.0 },
  { ticker: "TSLA", name: "Tesla, Inc.", shares: 25, price: 250.75, value: 6268.75, cost: 5500, gain: 14.0, allocation: 6.0, sector: "Automotive", dividendYield: 0.0 },
  { ticker: "NVDA", name: "NVIDIA Corporation", shares: 40, price: 950.20, value: 38008, cost: 30000, gain: 26.7, allocation: 36.5, sector: "Technology", dividendYield: 0.04 },
  { ticker: "JNJ", name: "Johnson & Johnson", shares: 60, price: 155.30, value: 9318, cost: 9000, gain: 3.5, allocation: 8.9, sector: "Healthcare", dividendYield: 2.6 },
];

const performanceData = [
  { month: 'Jan', portfolio: 750000, benchmark: 720000 },
  { month: 'Feb', portfolio: 765000, benchmark: 735000 },
  { month: 'Mar', portfolio: 780000, benchmark: 745000 },
  { month: 'Apr', portfolio: 790000, benchmark: 755000 },
  { month: 'May', portfolio: 805000, benchmark: 765000 },
  { month: 'Jun', portfolio: 826456, benchmark: 780000 },
  { month: 'Jul', portfolio: 835000, benchmark: 790000 },
  { month: 'Aug', portfolio: 845000, benchmark: 795000 },
  { month: 'Sep', portfolio: 860000, benchmark: 810000 },
  { month: 'Oct', portfolio: 880000, benchmark: 825000 },
  { month: 'Nov', portfolio: 900000, benchmark: 845000 },
  { month: 'Dec', portfolio: 920000, benchmark: 865000 }
];

const sectorData = [
  { name: 'Technology', value: 62, fill: '#3B82F6' },
  { name: 'Healthcare', value: 15, fill: '#10B981' },
  { name: 'Consumer', value: 9, fill: '#F59E0B' },
  { name: 'Automotive', value: 6, fill: '#EF4444' },
  { name: 'Finance', value: 5, fill: '#8B5CF6' },
  { name: 'Other', value: 3, fill: '#64748B' }
];

const assetAllocation = [
  { name: 'Stocks', value: 75, fill: '#3B82F6' },
  { name: 'ETFs', value: 15, fill: '#10B981' },
  { name: 'Cash', value: 10, fill: '#64748B' }
];

const riskReturnData = [
  { name: 'Portfolio', risk: 12, return: 15, size: 80 },
  { name: 'Benchmark', risk: 10, return: 12, size: 60 },
  { name: 'S&P 500', risk: 9, return: 10, size: 60 }
];

const upcomingDividends = [
  { ticker: "AAPL", amount: 210.30, date: "Jan 15, 2025", status: "Upcoming" },
  { ticker: "MSFT", amount: 195.20, date: "Jan 15, 2025", status: "Upcoming" },
  { ticker: "JNJ", amount: 204.56, date: "Jan 25, 2025", status: "Upcoming" },
  { ticker: "NVDA", amount: 215.24, date: "Jan 25, 2025", status: "Upcoming" }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#64748B'];

const Portfolio = () => {
  const [search, setSearch] = useState("");
  const [holdings, setHoldings] = useState(initialHoldings);
  const [sortType, setSortType] = useState("");
  const [activeTab, setActiveTab] = useState("holdings");
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [activePieIndex, setActivePieIndex] = useState(0);

  // Calculate totals
  const totalPortfolioValue = holdings.reduce((sum, stock) => sum + stock.value, 0);
  const totalCostBasis = holdings.reduce((sum, stock) => sum + stock.cost, 0);
  const totalGain = totalPortfolioValue - totalCostBasis;
  const totalGainPercent = (totalGain / totalCostBasis) * 100;
  const dayGain = totalPortfolioValue * 0.0154; // Mock 1.54% daily gain
  const dayGainPercent = 1.54;
  const annualDividend = holdings.reduce((sum, stock) => sum + (stock.value * (stock.dividendYield / 100)), 0);
  const dividendYield = (annualDividend / totalPortfolioValue) * 100;
  const cashBalance = 187654.23;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value).replace('₹', '₹');
  };

  // Filter and sort holdings
  let filteredHoldings = holdings.filter(stock =>
    stock.ticker.toLowerCase().includes(search.toLowerCase()) ||
    stock.name.toLowerCase().includes(search.toLowerCase())
  );

  if (sortType === "value") {
    filteredHoldings.sort((a, b) => b.value - a.value);
  } else if (sortType === "gain") {
    filteredHoldings.sort((a, b) => b.gain - a.gain);
  } else if (sortType === "allocation") {
    filteredHoldings.sort((a, b) => b.allocation - a.allocation);
  }

  // Pie chart event handlers
  const onPieEnter = (_, index) => {
    setActivePieIndex(index);
  };

  // Custom active shape for pie chart
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#fff" fontSize={14}>
          {payload.name}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#94A3B8" fontSize={12}>
          {`${(percent * 100).toFixed(1)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="bg-[#0A1428] min-h-screen text-white">
      <AfterLoginHeader />

      <div className="min-h-screen text-white px-4 mt-20 mb-10 sm:px-6 md:px-8 lg:px-16 pt-4 sm:pt-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2">
            My <span className="text-blue-400">Portfolio</span>
          </h1>
        </div>

        {/* Summary Card */}
        <div className="bg-[#101B33] rounded-2xl p-4 sm:p-6 border border-[#1b2e50] shadow-xl mb-6 sm:mb-8 transition-all hover:shadow-lg hover:border-[#2D3E5D]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">{formatCurrency(totalPortfolioValue)}</h2>
              <div className="flex items-center mt-1">
                {dayGainPercent >= 0 ? (
                  <ArrowUp className="text-green-400 h-4 w-4" />
                ) : (
                  <ArrowDown className="text-red-400 h-4 w-4" />
                )}
                <span className={`ml-1 text-sm sm:text-base font-semibold ${dayGainPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(dayGain)} ({dayGainPercent >= 0 ? '+' : ''}{dayGainPercent.toFixed(2)}%) Today
                </span>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-1 transition-all transform hover:scale-105 w-full md:w-auto justify-center">
                <Plus size={14} className="sm:w-4 sm:h-4" /> Add Position
              </button>
              <button className="bg-[#1E2A4A] hover:bg-[#2a3a62] text-blue-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-1 transition-all w-full md:w-auto justify-center">
                <Download size={14} className="sm:w-4 sm:h-4" /> Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { 
                icon: <TrendingUp size={14} className="sm:w-4 sm:h-4" />, 
                label: "Total Gain/Loss", 
                value: `${formatCurrency(totalGain)} (${totalGainPercent >= 0 ? '+' : ''}${totalGainPercent.toFixed(1)}%)`,
                color: totalGainPercent >= 0 ? 'text-green-400' : 'text-red-400'
              },
              { 
                icon: <Clock size={14} className="sm:w-4 sm:h-4" />, 
                label: "Day Gain/Loss", 
                value: `${formatCurrency(dayGain)} (${dayGainPercent >= 0 ? '+' : ''}${dayGainPercent.toFixed(2)}%)`,
                color: dayGainPercent >= 0 ? 'text-green-400' : 'text-red-400'
              },
              { 
                icon: <DollarSign size={14} className="sm:w-4 sm:h-4" />, 
                label: "Annual Dividend", 
                value: `${formatCurrency(annualDividend)} (${dividendYield.toFixed(2)}%)`,
                color: "text-white"
              },
              { 
                icon: <Layers size={14} className="sm:w-4 sm:h-4" />, 
                label: "Cash Balance", 
                value: formatCurrency(cashBalance),
                color: "text-white"
              }
            ].map((metric, index) => (
              <div key={index} className="bg-[#1E2A4A] p-2 sm:p-3 rounded-lg transition-all hover:bg-[#2a3a62]">
                <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-1">
                  {metric.icon} {metric.label}
                </div>
                <div className={`flex items-center text-sm sm:text-base font-semibold ${metric.color}`}>
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Performance Chart */}
          <div className="bg-[#101B33] rounded-xl p-3 sm:p-4 border border-[#1b2e50] h-[300px] sm:h-[350px] transition-all hover:border-[#2D3E5D]">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                <LineChartIcon size={16} className="sm:w-5 sm:h-5" /> Portfolio Performance
              </h3>
              <select className="bg-[#1E2A4A] text-xs sm:text-sm text-white rounded px-2 py-1 cursor-pointer">
                <option>1 Year</option>
                <option>6 Months</option>
                <option>3 Months</option>
                <option>1 Month</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3E5D" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#94A3B8" 
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E2A4A', 
                    borderColor: '#2D3E5D',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [formatCurrency(value), name]}
                  labelStyle={{ color: '#E2E8F0', fontWeight: 'bold', fontSize: 12 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => <span className="text-xs sm:text-sm text-gray-300">{value}</span>}
                />
                <Area 
                  type="monotone" 
                  dataKey="benchmark" 
                  fill="#1E2A4A" 
                  stroke="#64748B" 
                  fillOpacity={0.2} 
                  name="Benchmark"
                  strokeWidth={1.5}
                  activeDot={{ r: 6, stroke: '#64748B', strokeWidth: 2, fill: '#1E2A4A' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="portfolio" 
                  stroke="#3B82F6" 
                  strokeWidth={2} 
                  dot={false} 
                  name="Your Portfolio"
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#1E40AF' }}
                />
                <ReferenceLine y={750000} stroke="#64748B" strokeDasharray="3 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Allocation */}
          <div className="bg-[#101B33] rounded-xl p-3 sm:p-4 border border-[#1b2e50] h-[300px] sm:h-[350px] transition-all hover:border-[#2D3E5D]">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                <PieChartIcon size={16} className="sm:w-5 sm:h-5" /> Sector Allocation
              </h3>
              <div className="text-xs sm:text-sm text-gray-400">Diversification: Medium</div>
            </div>
            <div className="flex flex-col sm:flex-row h-[calc(100%-2rem)]">
              <div className="w-full sm:w-1/2 h-[200px] sm:h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activePieIndex}
                      activeShape={renderActiveShape}
                      data={sectorData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                      onMouseEnter={onPieEnter}
                      animationBegin={0}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="#0A1428" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E2A4A', 
                        borderColor: '#2D3E5D',
                        borderRadius: '0.5rem'
                      }}
                      formatter={(value, name) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full sm:w-1/2 sm:pl-3 flex flex-col justify-center overflow-y-auto max-h-full">
                {sectorData.map((sector, index) => (
                  <div 
                    key={sector.name} 
                    className={`flex items-center mb-1 sm:mb-2 p-1 sm:p-2 rounded-lg cursor-pointer transition-all ${activePieIndex === index ? 'bg-[#1E2A4A]' : 'hover:bg-[#1E2A4A]/50'}`}
                    onMouseEnter={() => setActivePieIndex(index)}
                  >
                    <div 
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2" 
                      style={{ backgroundColor: sector.fill }}
                    ></div>
                    <span className="text-xs sm:text-sm flex-1 truncate">{sector.name}</span>
                    <span className="text-xs sm:text-sm font-semibold ml-2">{sector.value}%</span>
                    <ChevronRight size={12} className="text-gray-400 ml-1 hidden sm:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk/Return Chart */}
          <div className="bg-[#101B33] rounded-xl p-3 sm:p-4 border border-[#1b2e50] h-[300px] sm:h-[350px] transition-all hover:border-[#2D3E5D]">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                <ScatterChartIcon size={16} className="sm:w-5 sm:h-5" /> Risk vs Return
              </h3>
              <div className="text-xs sm:text-sm">
                <span className="text-gray-400 mr-1 sm:mr-2">Sharpe Ratio:</span>
                <span className="font-semibold">1.32</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="80%">
              <ScatterChart
                margin={{ top: 20, right: 10, bottom: 30, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3E5D" />
                <XAxis 
                  type="number" 
                  dataKey="risk" 
                  name="Risk" 
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                >
                  <Label 
                    value="Risk (Volatility %)" 
                    offset={-5} 
                    position="insideBottom" 
                    fill="#94A3B8" 
                    fontSize={10}
                  />
                </XAxis>
                <YAxis 
                  type="number" 
                  dataKey="return" 
                  name="Return" 
                  stroke="#94A3B8"
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                >
                  <Label 
                    value="Return (%)" 
                    angle={-90} 
                    position="insideLeft" 
                    fill="#94A3B8" 
                    fontSize={10}
                  />
                </YAxis>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1E2A4A', 
                    borderColor: '#2D3E5D',
                    borderRadius: '0.5rem'
                  }}
                  formatter={(value, name, props) => [
                    `${props.payload.name}: ${value}%`,
                    name.charAt(0).toUpperCase() + name.slice(1)
                  ]}
                  labelStyle={{ color: '#E2E8F0', fontWeight: 'bold', fontSize: 12 }}
                />
                <Scatter 
                  name="Portfolio" 
                  data={riskReturnData.filter(d => d.name === 'Portfolio')} 
                  fill="#3B82F6" 
                  shape="circle"
                />
                <Scatter 
                  name="Benchmark" 
                  data={riskReturnData.filter(d => d.name !== 'Portfolio')} 
                  fill="#64748B" 
                  shape="square"
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value) => <span className="text-xs sm:text-sm text-gray-300">{value}</span>}
                />
                <ReferenceLine y={12} stroke="#64748B" strokeDasharray="3 3" />
                <ReferenceLine x={10} stroke="#64748B" strokeDasharray="3 3" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "1 Month", value: "+3.2%", change: "up" },
            { label: "3 Month", value: "+7.5%", change: "up" },
            { label: "1 Year", value: "+15.8%", change: "up" },
            { label: "Top Sector", value: "Technology (62%)", change: null }
          ].map((metric, index) => (
            <div key={index} className="bg-[#1E2A4A] p-2 sm:p-3 rounded-lg transition-all hover:bg-[#2a3a62]">
              <div className="text-gray-400 text-xs sm:text-sm mb-1">{metric.label}</div>
              <div className="flex items-center text-sm sm:text-base font-semibold">
                {metric.change === "up" && <ArrowUp className="text-green-400 h-3 w-3 sm:h-4 sm:w-4" />}
                {metric.change === "down" && <ArrowDown className="text-red-400 h-3 w-3 sm:h-4 sm:w-4" />}
                <span className={`ml-1 ${metric.change === "up" ? 'text-green-400' : metric.change === "down" ? 'text-red-400' : 'text-white'}`}>
                  {metric.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 hide-scrollbar border-b border-[#1b2e50] mb-4 sm:mb-6">
          {[
            { id: "holdings", label: "Holdings" },
            { id: "asset", label: "Asset Allocation" },
            { id: "dividends", label: "Upcoming Dividends" }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap relative text-sm sm:text-base ${
                activeTab === tab.id ? 'text-blue-400' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-t"></div>
              )}
            </button>
          ))}
        </div>

        {/* Holdings Table */}
        {activeTab === 'holdings' && (
          <div className="bg-[#101B33] rounded-xl border border-[#1b2e50] overflow-hidden transition-all hover:border-[#2D3E5D]">
            <div className="p-3 sm:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Stock or Company..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#1E2A4A] pl-8 sm:pl-10 pr-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <select
                  className="bg-[#1E2A4A] text-xs sm:text-sm text-white rounded px-2 sm:px-3 py-1.5 sm:py-2 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  onChange={(e) => setSortType(e.target.value)}
                  value={sortType}
                >
                  <option value="">Sort By</option>
                  <option value="value">Value</option>
                  <option value="gain">Gain/Loss</option>
                  <option value="allocation">Allocation</option>
                </select>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-[#1b2e50]">
                    {[
                      "Stock", "Shares", "Price", "Value", "Cost Basis", 
                      "Gain/Loss", "Allocation", "Sector", "Actions"
                    ].map((header, index) => (
                      <th 
                        key={index} 
                        className={`px-3 sm:px-4 py-2 sm:py-3 ${index === 0 ? 'pl-4 sm:pl-6' : ''} ${index === 8 ? 'pr-4 sm:pr-6' : ''}`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredHoldings.map((stock, i) => (
                    <tr 
                      key={i} 
                      className="border-b border-[#1b2e50] hover:bg-[#1E2A4A]/50 transition-colors"
                    >
                      <td className="px-3 sm:px-4 py-3 pl-4 sm:pl-6">
                        <div className="font-medium">{stock.ticker}</div>
                        <div className="text-gray-400 text-xs">{stock.name}</div>
                      </td>
                      <td className="py-3">{stock.shares}</td>
                      <td className="py-3">{formatCurrency(stock.price)}</td>
                      <td className="py-3">{formatCurrency(stock.value)}</td>
                      <td className="py-3">{formatCurrency(stock.cost)}</td>
                      <td className={`py-3 ${stock.gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.gain >= 0 ? '+' : ''}{stock.gain}%
                      </td>
                      <td className="py-3">{stock.allocation.toFixed(1)}%</td>
                      <td className="py-3">
                        <span 
                          className="px-2 py-1 bg-[#1E2A4A] text-xs rounded-full"
                          style={{ 
                            backgroundColor: sectorData.find(s => s.name === stock.sector)?.fill + '20',
                            color: sectorData.find(s => s.name === stock.sector)?.fill
                          }}
                        >
                          {stock.sector}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 pr-4 sm:pr-6">
                        <button 
                          className="text-gray-400 hover:text-white p-1 rounded-full transition-colors"
                          onClick={() => {/* Add action here */}}
                        >
                          <MoreVertical size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 p-3 sm:p-4">
              {filteredHoldings.map((stock, i) => (
                <div key={i} className="bg-[#1E2A4A] p-3 sm:p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm sm:text-base">{stock.ticker}</div>
                      <div className="text-gray-400 text-xs sm:text-sm">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm sm:text-base">{formatCurrency(stock.value)}</div>
                      <div className={`text-xs sm:text-sm ${stock.gain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.gain >= 0 ? '+' : ''}{stock.gain}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs sm:text-sm">
                    <div>
                      <div className="text-gray-400">Shares</div>
                      <div>{stock.shares}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Price</div>
                      <div>{formatCurrency(stock.price)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Cost Basis</div>
                      <div>{formatCurrency(stock.cost)}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Allocation</div>
                      <div>{stock.allocation.toFixed(1)}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <span 
                      className="px-2 py-1 bg-[#1E2A4A] text-xs rounded-full"
                      style={{ 
                        backgroundColor: sectorData.find(s => s.name === stock.sector)?.fill + '20',
                        color: sectorData.find(s => s.name === stock.sector)?.fill
                      }}
                    >
                      {stock.sector}
                    </span>
                    <button 
                      className="text-gray-400 hover:text-white p-1 rounded-full transition-colors"
                      onClick={() => {/* Add action here */}}
                    >
                      <MoreVertical size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Asset Allocation */}
        {activeTab === 'asset' && (
          <div className="bg-[#101B33] rounded-xl border border-[#1b2e50] p-4 sm:p-6 transition-all hover:border-[#2D3E5D]">
            <h3 className="font-semibold mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
              <PieChartIcon size={16} className="sm:w-5 sm:h-5" /> Asset Allocation
            </h3>
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              <div className="lg:w-1/2 h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      animationBegin={0}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.fill} 
                          stroke="#0A1428" 
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1E2A4A', 
                        borderColor: '#2D3E5D',
                        borderRadius: '0.5rem'
                      }}
                      formatter={(value) => [`${value}%`, 'Allocation']}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '10px' }}
                      formatter={(value) => <span className="text-xs sm:text-sm text-gray-300">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="lg:w-1/2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {assetAllocation.map((asset, index) => (
                    <div 
                      key={asset.name} 
                      className="bg-[#1E2A4A] p-3 sm:p-4 rounded-lg transition-all hover:bg-[#2a3a62] hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div 
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
                          style={{ backgroundColor: asset.fill }}
                        ></div>
                        <div>
                          <div className="font-medium text-sm sm:text-base">{asset.name}</div>
                          <div className="text-xl sm:text-2xl font-bold mt-1">{asset.value}%</div>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-3 h-2 bg-[#0A1428] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${asset.value}%`,
                            backgroundColor: asset.fill
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Dividends */}
        {activeTab === 'dividends' && (
          <div className="bg-[#101B33] rounded-xl border border-[#1b2e50] p-4 sm:p-6 transition-all hover:border-[#2D3E5D]">
            <h3 className="font-semibold mb-4 sm:mb-6 flex items-center gap-2 text-sm sm:text-base">
              <DollarSign size={16} className="sm:w-5 sm:h-5" /> Upcoming Dividends
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {upcomingDividends.map((dividend, index) => (
                <div 
                  key={index} 
                  className="bg-[#1E2A4A] p-3 sm:p-4 rounded-lg hover:bg-[#2a3a62] transition-all transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm sm:text-base">{dividend.ticker}</div>
                      <div className="text-gray-400 text-xs sm:text-sm">{dividend.date}</div>
                    </div>
                    <div className="bg-blue-900/30 text-blue-400 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                      {formatCurrency(dividend.amount)}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 sm:pt-3 border-t border-[#2D3E5D] flex justify-between items-center">
                    <span className="text-gray-400 text-xs sm:text-sm">Status</span>
                    <span 
                      className={`text-xs sm:text-sm font-medium ${
                        dividend.status === 'Upcoming' ? 'text-green-400' : 
                        dividend.status === 'Paid' ? 'text-blue-400' : 'text-gray-400'
                      }`}
                    >
                      {dividend.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AllPageFooter />
    </div>
  );
};

export default Portfolio;