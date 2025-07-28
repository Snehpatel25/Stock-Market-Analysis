import React, { useState, useEffect } from 'react';
import { Search, User, Bell, TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Calendar, Twitter, Instagram, Facebook, Youtube } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import AllPageFooter from '../componants/AllPageFooter';
import AfterLoginHeader from '../componants/AfterLoginHeader';
import TradingView from '../componants/TradingView';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Market = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [rsiData, setRsiData] = useState(null);
  const [macdData, setMacdData] = useState(null);
  const [news, setNews] = useState([]);
  const [financials, setFinancials] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timeframe options - reduced for mobile
  const timeframes = isMobile ? ['1D', '1W', '1M', '1Y'] : ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'Max'];

  // Model performance data
  const modelData = [
    {
      name: 'LSTM',
      color: 'bg-blue-500',
      accuracy: '87%',
      rmse: '2.34',
      mae: '1.89',
      sevenDay: '-2.1%',
      thirtyDay: '14.8%',
      consensus: '+2.0%'
    },
    {
      name: 'GRU',
      color: 'bg-yellow-500',
      accuracy: '83%',
      rmse: '2.87',
      mae: '2.15',
      sevenDay: '+2.1%',
      thirtyDay: '+4.9%',
      consensus: '+2.3%'
    },
    {
      name: 'Prophet',
      color: 'bg-cyan-500',
      accuracy: '79%',
      rmse: '3.12',
      mae: '2.45',
      sevenDay: '+1.8%',
      thirtyDay: '+3.2%',
      consensus: '+1.9%'
    }
  ];

  // Simulate fetching stock data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchStockData = () => {
      const dates = generateDates(selectedTimeframe);
      const prices = generateRandomPrices(dates.length, 18000, 19000);
      const predictedPrices = prices.map((price, i) =>
        i < dates.length - 7 ? null : price * (1 + (Math.random() * 0.02 - 0.01))
      );

      setStockData({
        symbol: 'AAPL',
        price: `$${(prices[prices.length - 1]).toFixed(2)}`,
        change: `${(Math.random() > 0.5 ? '+' : '-')}${(Math.random() * 2).toFixed(2)}%`,
        isPositive: Math.random() > 0.5,
        marketCap: '$2.8T',
        peRatio: '28.5',
        dayRange: `$${(18000 + Math.random() * 1000).toFixed(2)} - $${(18500 + Math.random() * 1000).toFixed(2)}`
      });

      setChartData({
        labels: dates,
        datasets: [
          {
            label: 'Actual Price',
            data: prices,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.1,
            fill: true
          },
          {
            label: 'Predicted Price',
            data: predictedPrices,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderDash: [5, 5],
            tension: 0.1
          }
        ]
      });

      // Generate RSI data
      const rsiValues = Array(dates.length).fill(0).map((_, i) => {
        if (i < 14) return 50;
        return 30 + Math.random() * 40;
      });

      setRsiData({
        labels: dates,
        datasets: [
          {
            label: 'RSI',
            data: rsiValues,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.1
          },
          {
            label: 'Overbought',
            data: Array(dates.length).fill(70),
            borderColor: '#ef4444',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0
          },
          {
            label: 'Oversold',
            data: Array(dates.length).fill(30),
            borderColor: '#10b981',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0
          }
        ]
      });

      // Generate MACD data
      const macdLine = Array(dates.length).fill(0).map((_, i) => (Math.random() * 4 - 2));
      const signalLine = macdLine.map(val => val * 0.8 + (Math.random() * 0.5 - 0.25));
      const histogram = macdLine.map((val, i) => val - signalLine[i]);

      setMacdData({
        labels: dates,
        datasets: [
          {
            label: 'MACD Line',
            data: macdLine,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.1
          },
          {
            label: 'Signal Line',
            data: signalLine,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.1
          },
          {
            label: 'Histogram',
            data: histogram,
            backgroundColor: histogram.map(val =>
              val > 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'
            ),
            type: 'bar',
            borderColor: 'transparent'
          }
        ]
      });

      // Generate financial data
      setFinancials({
        revenue: [
          { quarter: 'Q1', value: `$${(94.83 + Math.random() * 10).toFixed(2)}B` },
          { quarter: 'Q2', value: `$${(81.80 + Math.random() * 10).toFixed(2)}B` },
          { quarter: 'Q3', value: `$${(89.58 + Math.random() * 10).toFixed(2)}B` },
          { quarter: 'Q4', value: `$${(119.58 + Math.random() * 10).toFixed(2)}B` }
        ],
        eps: [
          { quarter: 'Q1', value: `$${(1.53 + Math.random() * 0.2).toFixed(2)}` },
          { quarter: 'Q2', value: `$${(1.26 + Math.random() * 0.2).toFixed(2)}` },
          { quarter: 'Q3', value: `$${(1.29 + Math.random() * 0.2).toFixed(2)}` },
          { quarter: 'Q4', value: `$${(2.18 + Math.random() * 0.2).toFixed(2)}` }
        ],
        portfolio: [
          { quarter: 'Q1', value: `$${(94.83 + Math.random() * 10).toFixed(2)}B` },
          { quarter: 'Q2', value: `$${(81.80 + Math.random() * 10).toFixed(2)}B` },
          { quarter: 'Q3', value: `$${(89.58 + Math.random() * 10).toFixed(2)}B` },
          { quarter: 'Q4', value: `$${(119.58 + Math.random() * 10).toFixed(2)}B` }
        ]
      });

      // Generate news
      setNews([
        {
          title: 'Apple announces new AI features for iOS 19',
          sentiment: 'Positive',
          sentimentColor: 'text-green-400',
          source: 'TechCrunch',
          date: 'May 24, 2025',
          content: 'Apple unveiled groundbreaking AI capabilities coming to iOS 19, including an enhanced Siri and real-time translation features that sent tech stocks higher.'
        },
        {
          title: 'Q2 Earnings beat expectations by 5%',
          sentiment: 'Positive',
          sentimentColor: 'text-green-400',
          source: 'Reuters',
          date: 'May 23, 2025',
          content: 'Apple reported Q2 earnings of $1.53 per share, beating analyst estimates by 5%. Revenue grew 8% year-over-year to $94.83 billion.'
        },
        {
          title: 'New MacBook Pro models expected next month',
          sentiment: 'Neutral',
          sentimentColor: 'text-yellow-400',
          source: 'Bloomberg',
          date: 'May 20, 2025',
          content: 'Sources indicate Apple will refresh its MacBook Pro lineup next month with M3 Pro and M3 Max chips, though supply chain issues may limit initial availability.'
        }
      ]);
    };

    fetchStockData();
  }, [selectedTimeframe, selectedStock]);

  // Helper functions
  const generateDates = (timeframe) => {
    const now = new Date();
    let count = 30; // Default for 1M

    switch (timeframe) {
      case '1D':
        count = 24; // Hourly data
        return Array(count).fill(0).map((_, i) => {
          const date = new Date(now);
          date.setHours(now.getHours() - (count - i - 1));
          return date.toLocaleTimeString([], { hour: '2-digit' });
        });
      case '1W':
        count = 7;
        return Array(count).fill(0).map((_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - (count - i - 1));
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        });
      case '1M':
        count = 30;
        break;
      case '3M':
        count = 90;
        break;
      case '6M':
        count = 180;
        break;
      case '1Y':
        count = 365;
        break;
      case '5Y':
        count = 60; // Monthly data for 5 years
        return Array(count).fill(0).map((_, i) => {
          const date = new Date(now);
          date.setMonth(now.getMonth() - (count - i - 1));
          return date.toLocaleDateString([], { year: 'numeric', month: 'short' });
        });
      case 'Max':
        count = 120; // Monthly data for 10 years
        return Array(count).fill(0).map((_, i) => {
          const date = new Date(now);
          date.setMonth(now.getMonth() - (count - i - 1));
          return date.toLocaleDateString([], { year: 'numeric', month: 'short' });
        });
    }

    return Array(count).fill(0).map((_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (count - i - 1));
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    });
  };

  const generateRandomPrices = (count, min, max) => {
    const prices = [];
    let current = min + Math.random() * (max - min);

    for (let i = 0; i < count; i++) {
      prices.push(current);
      current = current * (1 + (Math.random() * 0.02 - 0.01)); // Random walk
      if (current < min * 0.9) current = min * 0.9;
      if (current > max * 1.1) current = max * 1.1;
    }

    return prices;
  };

  // Event handlers
  const handleAddToWatchlist = () => {
    if (!watchlist.includes(selectedStock)) {
      setWatchlist([...watchlist, selectedStock]);
    }
  };

  const handleAddToPortfolio = () => {
    const existingPosition = portfolio.find(p => p.symbol === selectedStock);
    if (existingPosition) {
      setPortfolio(portfolio.map(p =>
        p.symbol === selectedStock
          ? { ...p, shares: p.shares + 1 }
          : p
      ));
    } else {
      setPortfolio([
        ...portfolio,
        {
          symbol: selectedStock,
          shares: 1,
          avgPrice: stockData.price.replace('$', ''),
          currentPrice: stockData.price.replace('$', '')
        }
      ]);
    }
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff',
          maxRotation: isMobile ? 45 : 0,
          autoSkip: true,
          maxTicksLimit: isMobile ? 8 : 12
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      }
    },
    maintainAspectRatio: false
  };

  const rsiOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff',
          maxRotation: isMobile ? 45 : 0,
          autoSkip: true,
          maxTicksLimit: isMobile ? 8 : 12
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      }
    },
    maintainAspectRatio: false
  };

  const macdOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff',
          maxRotation: isMobile ? 45 : 0,
          autoSkip: true,
          maxTicksLimit: isMobile ? 8 : 12
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <AfterLoginHeader />

      {/* Main Content */}
      <div className="min-h-screen text-white px-2 sm:px-4 md:px-6 lg:px-8 pt-4 mt-16 sm:mt-20 sm:pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1 sm:mb-2">
              Market <span className="text-blue-400">Analysis</span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 text-xs sm:text-sm text-gray-400">
              <span>Watchlist: {watchlist.join(', ') || 'None'}</span>
              <span className="hidden sm:inline">|</span>
              <span>Portfolio: {portfolio.length} positions</span>
            </div>
          </div>
        </div>

        {/* Stock Info Section */}
        {stockData && (
          <div className="bg-[#101B33] rounded-lg p-4 sm:p-6 mb-6 border border-[#1b2e50]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
              <div className="w-full sm:w-auto">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">{selectedStock} - Apple Inc.</h2>
                <div className="flex flex-wrap items-center gap-x-4 mt-2 text-xs sm:text-sm text-gray-400">
                  <span>Market Cap: {stockData.marketCap}</span>
                  <span>P/E: {stockData.peRatio}</span>
                  <span>Day Range: {stockData.dayRange}</span>
                </div>
              </div>
              <div className="w-full sm:w-auto text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold">{stockData.price}</div>
                <div className={`flex items-center ${stockData.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {stockData.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  <span>{stockData.change}</span>
                </div>
                <div className="flex sm:justify-end gap-2 mt-2">
                  <button
                      className="bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm"
                    onClick={handleAddToWatchlist}
                  >
                    + Watchlist
                  </button>
                  <button
                    className="bg-[#1E2A4A] hover:bg-[#2a3a62] px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm"
                    onClick={handleAddToPortfolio}
                  >
                    + Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart Section */}
        <div className="bg-[#101B33] rounded-xl p-4 sm:p-6 mb-6 border border-[#1b2e50]">
          <TradingView/>
        </div>

        {/* Model Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {modelData.map((model, index) => (
            <div key={index} className="bg-[#101B33] rounded-lg p-4 sm:p-6 border border-[#1b2e50]">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className={`w-3 h-3 sm:w-4 sm:h-4 ${model.color} rounded mr-2 sm:mr-3`}></div>
                <h3 className="text-base sm:text-lg font-bold">{model.name}</h3>
                <div className="ml-auto text-right">
                  <div className="text-xs sm:text-sm text-gray-400">Accuracy</div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Accuracy</span>
                  <span className="font-medium">{model.accuracy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">RMSE</span>
                  <span className="font-medium">{model.rmse}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MAE</span>
                  <span className="font-medium">{model.mae}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">7-day</span>
                  <span className={`font-medium ${model.sevenDay.includes('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {model.sevenDay}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">7-day Consensus</span>
                  <span className="font-medium text-green-400">{model.consensus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">30-day</span>
                  <span className="font-medium text-green-400">{model.thirtyDay}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Enhanced RSI Indicator */}
          <div className="bg-[#101B33] rounded-xl p-4 sm:p-6 border border-[#1b2e50] hover:border-purple-500 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-bold flex items-center">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                RSI (14)
              </h3>
              <div className="flex items-center gap-2">
                <div className="text-xs sm:text-sm px-2 py-1 rounded-lg bg-purple-900/30 text-purple-400">
                  Current: 62.5
                </div>
                <div className="text-xs sm:text-sm px-2 py-1 rounded-lg bg-blue-900/30 text-blue-400">
                  Neutral
                </div>
              </div>
            </div>

            <div className="h-48 sm:h-56 md:h-64 bg-[#0A1428] rounded-lg border border-[#1b2e50] p-2 sm:p-4">
              {rsiData ? (
                <Line
                  data={rsiData}
                  options={rsiOptions}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                  Loading RSI data...
                </div>
              )}
            </div>

            <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1 sm:gap-2 text-center text-xs sm:text-sm">
              <div className="bg-[#1E2A4A] p-1 sm:p-2 rounded-lg">
                <div className="text-gray-400">14-Day Avg</div>
                <div className="font-medium">58.2</div>
              </div>
              <div className="bg-[#1E2A4A] p-1 sm:p-2 rounded-lg">
                <div className="text-gray-400">High</div>
                <div className="font-medium text-red-400">72.3</div>
              </div>
              <div className="bg-[#1E2A4A] p-1 sm:p-2 rounded-lg">
                <div className="text-gray-400">Low</div>
                <div className="font-medium text-green-400">28.7</div>
              </div>
            </div>
          </div>

          {/* MACD */}
          <div className="bg-[#101B33] rounded-xl p-4 sm:p-6 border border-[#1b2e50] hover:border-cyan-500 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-bold flex items-center">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-cyan-400" />
                MACD (12,26,9)
              </h3>
              <div className="flex items-center gap-2">
                <div className="text-xs sm:text-sm px-2 py-1 rounded-lg bg-cyan-900/30 text-cyan-400">
                  MACD: 1.23
                </div>
                <div className="text-xs sm:text-sm px-2 py-1 rounded-lg bg-cyan-900/30 text-cyan-400">
                  Signal: 0.98
                </div>
              </div>
            </div>

            <div className="h-48 sm:h-56 md:h-64 bg-[#0A1428] rounded-lg border border-[#1b2e50] p-2 sm:p-4">
              {macdData ? (
                <Bar
                  data={macdData}
                  options={macdOptions}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs sm:text-sm">
                  Loading MACD data...
                </div>
              )}
            </div>

            <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1 sm:gap-2 text-center text-xs sm:text-sm">
              <div className="bg-[#1E2A4A] p-1 sm:p-2 rounded-lg">
                <div className="text-gray-400">Histogram</div>
                <div className="font-medium text-green-400">+0.25</div>
              </div>
              <div className="bg-[#1E2A4A] p-1 sm:p-2 rounded-lg">
                <div className="text-gray-400">Last Cross</div>
                <div className="font-medium text-green-400">Bullish</div>
              </div>
              <div className="bg-[#1E2A4A] p-1 sm:p-2 rounded-lg">
                <div className="text-gray-400">Divergence</div>
                <div className="font-medium">None</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Financial Data Grid */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
              Financial Performance Metrics
            </div>
            <span className="text-xs sm:text-sm text-gray-400 bg-[#1E2A4A] px-2 sm:px-3 py-1 rounded-full sm:ml-auto">
              Last Updated: {new Date().toLocaleDateString()}
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Revenue Card */}
            <div className="bg-[#101B33] rounded-xl p-4 sm:p-6 border border-[#1b2e50] hover:border-green-500 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
                    Quarterly Revenue
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Year-over-Year Growth</p>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-green-400">
                    {financials?.revenue[financials.revenue.length - 1].value}
                  </div>
                  <div className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded-full">
                    +8.2% YoY
                  </div>
                </div>
              </div>

              <div className="h-32 sm:h-40 mb-3 sm:mb-4 relative">
                {financials && (
                  <Line
                    data={{
                      labels: financials.revenue.map(item => item.quarter),
                      datasets: [{
                        label: 'Revenue',
                        data: financials.revenue.map(item => parseFloat(item.value.replace(/[^0-9.]/g, ''))),
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#10b981',
                        pointRadius: 3,
                        pointHoverRadius: 5
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: '#9ca3af', maxRotation: 0 }
                        },
                        y: { display: false }
                      }
                    }}
                  />
                )}
              </div>

              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-xs sm:text-sm">
                {financials?.revenue.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-gray-400">{item.quarter}</div>
                    <div className="font-medium">{item.value}</div>
                    <div className={`${index > 0 && parseFloat(item.value.replace(/[^0-9.]/g, '')) >
                      parseFloat(financials.revenue[index - 1].value.replace(/[^0-9.]/g, '')) ?
                      'text-green-400' : 'text-red-400'
                      }`}>
                      {index > 0 ? (
                        `${((parseFloat(item.value.replace(/[^0-9.]/g, '')) /
                          parseFloat(financials.revenue[index - 1].value.replace(/[^0-9.]/g, '')) - 1) * 100).toFixed(1)}%`
                      ) : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EPS Card */}
            <div className="bg-[#101B33] rounded-xl p-4 sm:p-6 border border-[#1b2e50] hover:border-blue-500 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
                    Earnings Per Share
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Quarterly Performance</p>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400">
                    {financials?.eps[financials.eps.length - 1].value}
                  </div>
                  <div className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded-full">
                    +12.5% QoQ
                  </div>
                </div>
              </div>

              <div className="h-32 sm:h-40 mb-3 sm:mb-4">
                {financials && (
                  <Bar
                    data={{
                      labels: financials.eps.map(item => item.quarter),
                      datasets: [{
                        label: 'EPS',
                        data: financials.eps.map(item => parseFloat(item.value.replace(/[^0-9.]/g, ''))),
                        backgroundColor: financials.eps.map((item, index) =>
                          index > 0 && parseFloat(item.value.replace(/[^0-9.]/g, '')) >
                            parseFloat(financials.eps[index - 1].value.replace(/[^0-9.]/g, '')) ?
                            'rgba(59, 130, 246, 0.8)' : 'rgba(239, 68, 68, 0.8)'
                        ),
                        borderRadius: 2,
                        borderSkipped: false
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: '#9ca3af', maxRotation: 0 }
                        },
                        y: { display: false }
                      }
                    }}
                  />
                )}
              </div>

              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-xs sm:text-sm">
                {financials?.eps.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-gray-400">{item.quarter}</div>
                    <div className="font-medium">{item.value}</div>
                    <div className={`${index > 0 && parseFloat(item.value.replace(/[^0-9.]/g, '')) >
                      parseFloat(financials.eps[index - 1].value.replace(/[^0-9.]/g, '')) ?
                      'text-blue-400' : 'text-red-400'
                      }`}>
                      {index > 0 ? (
                        `${((parseFloat(item.value.replace(/[^0-9.]/g, '')) /
                          parseFloat(financials.eps[index - 1].value.replace(/[^0-9.]/g, '')) - 1) * 100).toFixed(1)}%`
                      ) : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Performance Card */}
            <div className="bg-[#101B33] rounded-xl p-4 sm:p-6 border border-[#1b2e50] hover:border-purple-500 transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-400" />
                    Portfolio Value
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Quarterly Growth</p>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-purple-400">
                    {financials?.portfolio[financials.portfolio.length - 1].value}
                  </div>
                  <div className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded-full">
                    +6.8% QoQ
                  </div>
                </div>
              </div>

              <div className="h-32 sm:h-40 mb-3 sm:mb-4 relative flex items-center justify-center">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#1E2A4A"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                      strokeLinecap="round"
                      style={{ strokeDashoffset: 75 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-lg sm:text-xl font-bold">+26%</span>
                    <span className="text-xs text-gray-400">YTD</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-xs sm:text-sm">
                {financials?.portfolio.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="text-gray-400">{item.quarter}</div>
                    <div className="font-medium">{item.value}</div>
                    <div className={`${index > 0 && parseFloat(item.value.replace(/[^0-9.]/g, '')) >
                      parseFloat(financials.portfolio[index - 1].value.replace(/[^0-9.]/g, '')) ?
                      'text-purple-400' : 'text-red-400'
                      }`}>
                      {index > 0 ? (
                        `${((parseFloat(item.value.replace(/[^0-9.]/g, '')) /
                          parseFloat(financials.portfolio[index - 1].value.replace(/[^0-9.]/g, '')) - 1) * 100).toFixed(1)}%`
                      ) : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* News Section */}
        <div className="bg-[#101B33] rounded-lg p-4 sm:p-6 mb-6 border border-[#1b2e50]">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            News & Events
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {news.map((newsItem, index) => (
              <div
                key={index}
                className="border-b border-[#1b2e50] pb-3 sm:pb-4 last:border-b-0 cursor-pointer hover:bg-[#1E2A4A] px-2 -mx-2 rounded"
              >
                <h4 className="text-sm sm:text-base font-medium mb-1 sm:mb-2">{newsItem.title}</h4>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-400 gap-1 sm:gap-4">
                  <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4">
                    <span className={`${newsItem.sentimentColor} font-medium`}>
                      {newsItem.sentiment} (87%)
                    </span>
                    <span>Source: {newsItem.source}</span>
                  </div>
                  <span>{newsItem.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AllPageFooter />
    </div>
  );
};

export default Market;