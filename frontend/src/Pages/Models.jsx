import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, TrendingUp, TrendingDown, Star, Download, RefreshCw, Settings } from "lucide-react";
import AllPageFooter from "../componants/AllPageFooter";
import AfterLoginHeader from "../componants/AfterLoginHeader";

const Model = () => {
  const { isLoggedIn } = useAuth();
  const [selectedStock, setSelectedStock] = useState("AAPL - Apple Inc.");
  const [trainingPeriod, setTrainingPeriod] = useState("Jan 2023 - Apr 2024");
  const [forecastHorizon, setForecastHorizon] = useState("30 Days");
  const [selectedModels, setSelectedModels] = useState({
    LSTM: true,
    GRU: true,
    Prophet: true,
    ARIMA: true,
    Ensemble: true,
    Custom: false
  });
  const [favoriteStocks, setFavoriteStocks] = useState([]);
  const [tickerPaused, setTickerPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stockTicker = [
    { symbol: "NIFTY", price: "25,000.10", change: "+0.25%", volume: "12.5M" },
    { symbol: "NIFTY BANK", price: "50,520.21", change: "+0.22%", volume: "8.2M" },
    { symbol: "HDFCBANK", price: "1,595.00", change: "-0.15%", volume: "3.7M" },
    { symbol: "ITC", price: "440.60", change: "+1.25%", volume: "5.1M" },
    { symbol: "MARUTI", price: "12,245", change: "+0.85%", volume: "1.2M" },
    { symbol: "BAJFINANCE", price: "6,581.00", change: "-1.25%", volume: "2.3M" }
  ];

  const metricsData = [
    { metric: "RMSE", LSTM: "2.34", GRU: "2.68", Prophet: "2.41", Ensemble: "2.18" },
    { metric: "MAE", LSTM: "1.87", GRU: "2.12", Prophet: "1.95", Ensemble: "1.72" },
    { metric: "MAPE", LSTM: "1.24%", GRU: "1.45%", Prophet: "1.32%", Ensemble: "1.08%" },
    { metric: "R²", LSTM: "0.92", GRU: "0.89", Prophet: "0.91", Ensemble: "0.94" },
    { metric: "Accuracy", LSTM: "88.5%", GRU: "85.2%", Prophet: "87.3%", Ensemble: "91.2%" }
  ];

  const marketStats = [
    { label: "Bull Market", value: "92% Accuracy" },
    { label: "Bear Market", value: "83% Accuracy" },
    { label: "Sideways", value: "88% Accuracy" },
    { label: "Longest Win Streak", value: "8 days" },
    { label: "Longest Loss Streak", value: "3 days" },
    { label: "Win Rate", value: "78%" }
  ];

  const variableImpact = [
    { variable: "Previous day close", impact: "0.85" },
    { variable: "10-day moving average", impact: "0.72" },
    { variable: "Trading volume", impact: "0.64" }
  ];

  const correlationData = [
    { feature: "Threshold", value: "0.7" },
    { feature: "Highly Correlated Pairs", value: "5" },
    { feature: "Independent Features", value: "8" }
  ];

  const modelConfig = [
    { parameter: "Layers", LSTM: "3", GRU: "2", Prophet: "N/A", Ensemble: "N/A" },
    { parameter: "Neurons", LSTM: "128,64,32", GRU: "128,64", Prophet: "N/A", Ensemble: "N/A" },
    { parameter: "Dropout", LSTM: "0.2", GRU: "0.3", Prophet: "N/A", Ensemble: "N/A" },
    { parameter: "Learning Rate", LSTM: "0.001", GRU: "0.001", Prophet: "N/A", Ensemble: "N/A" }
  ];

  const handleModelToggle = (model) => {
    setSelectedModels(prev => ({
      ...prev,
      [model]: !prev[model]
    }));
  };

  const toggleFavorite = (symbol) => {
    if (favoriteStocks.includes(symbol)) {
      setFavoriteStocks(favoriteStocks.filter(s => s !== symbol));
    } else {
      setFavoriteStocks([...favoriteStocks, symbol]);
    }
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <>
      <AfterLoginHeader/>      
      <div className="bg-[#0A1428] min-h-screen text-white mt-20 px-4 sm:px-6 md:px-8 lg:px-16 pt-4 sm:pt-6">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2">
              Model <span className="text-blue-400">Comparison</span>
            </h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={refreshData}
                className="text-blue-400 hover:text-blue-300 flex items-center text-xs sm:text-sm"
              >
                <RefreshCw size={isMobile ? 14 : 16} className="mr-1" />
                Refresh Data
              </button>
              <button className="text-blue-400 hover:text-blue-300 flex items-center text-xs sm:text-sm">
                <Download size={isMobile ? 14 : 16} className="mr-1" />
                Export Results
              </button>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-[#111D38] rounded-xl border border-[#1E2A4A] p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2 flex items-center">
                Stock:
                {favoriteStocks.length > 0 && (
                  <button 
                    onClick={() => setSelectedStock(favoriteStocks[0] + " - " + favoriteStocks[0] + " Inc.")}
                    className="ml-2 text-yellow-400 hover:text-yellow-300"
                  >
                    <Star size={isMobile ? 12 : 14} fill="currentColor" />
                  </button>
                )}
              </label>
              <select 
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full bg-[#1E2A4A] border border-[#2A3F5F] rounded-lg px-3 py-1 sm:px-4 sm:py-2 text-white focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
              >
                <option>AAPL - Apple Inc.</option>
                <option>GOOGL - Alphabet Inc.</option>
                <option>MSFT - Microsoft Corp.</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Training Period:</label>
              <select 
                value={trainingPeriod}
                onChange={(e) => setTrainingPeriod(e.target.value)}
                className="w-full bg-[#1E2A4A] border border-[#2A3F5F] rounded-lg px-3 py-1 sm:px-4 sm:py-2 text-white focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
              >
                <option>Jan 2023 - Apr 2024</option>
                <option>Jan 2022 - Dec 2023</option>
                <option>Jan 2021 - Dec 2022</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">Forecast Horizon:</label>
              <select 
                value={forecastHorizon}
                onChange={(e) => setForecastHorizon(e.target.value)}
                className="w-full bg-[#1E2A4A] border border-[#2A3F5F] rounded-lg px-3 py-1 sm:px-4 sm:py-2 text-white focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
              >
                <option>30 Days</option>
                <option>60 Days</option>
                <option>90 Days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2 sm:mb-3">Select Models to Compare:</label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {Object.entries(selectedModels).map(([model, isSelected]) => (
                <button
                  key={model}
                  onClick={() => handleModelToggle(model)}
                  className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-[#1E2A4A] text-gray-300 hover:bg-[#2A3F5F]'
                  }`}
                >
                  {model}
                  {isSelected && <span className="ml-1">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prediction Comparison Charts */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Prediction Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {Object.entries(selectedModels).filter(([_, selected]) => selected).map(([model]) => (
              <div key={model} className="bg-[#111D38] rounded-xl border border-[#1E2A4A] p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4">{model} Prediction</h3>
                <div className="h-48 sm:h-64 bg-[#0A1428] rounded-lg flex items-center justify-center">
                  {isLoading ? (
                    <div className="text-center">
                      <div className={`w-12 sm:w-16 h-12 sm:h-16 border-4 ${
                        model === 'LSTM' ? 'border-blue-500' :
                        model === 'GRU' ? 'border-green-500' :
                        'border-purple-500'
                      } border-t-transparent rounded-full animate-spin mx-auto mb-2 sm:mb-4`}></div>
                      <p className="text-gray-400 text-xs sm:text-sm">Loading {model} Chart...</p>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs sm:text-sm">Chart showing {model} predictions</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Comparison Table */}
        <div className="bg-[#111D38] rounded-xl border border-[#1E2A4A] p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Performance Metrics</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#1E2A4A]">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">Metric</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">LSTM</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">GRU</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">Prophet</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">Ensemble</th>
                </tr>
              </thead>
              <tbody>
                {metricsData.map((row, index) => (
                  <tr key={index} className="border-b border-[#1E2A4A] hover:bg-[#1E2A4A]/30">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-white font-medium text-xs sm:text-sm">{row.metric}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm">{row.LSTM}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm">{row.GRU}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm">{row.Prophet}</td>
                    <td className={`py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm ${
                      index === metricsData.length - 1 ? 'text-green-400 font-medium' : 'text-gray-300'
                    }`}>
                      {row.Ensemble}
                      {index === metricsData.length - 1 && (
                        <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs bg-green-900/30 text-green-300 px-1 py-0.5 sm:px-1.5 sm:py-0.5 rounded">BEST</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance Charts and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          {/* Performance Over Time */}
          <div className="bg-[#111D38] rounded-xl border border-[#1E2A4A] p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Performance Over Time</h2>
            <div className="h-48 sm:h-64 bg-[#0A1428] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              {isLoading ? (
                <div className="text-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2 sm:mb-4"></div>
                  <p className="text-gray-400 text-xs sm:text-sm">Loading performance data...</p>
                </div>
              ) : (
                <p className="text-gray-400 text-xs sm:text-sm">Line chart showing prediction accuracy over different market conditions</p>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {marketStats.slice(0, 3).map((stat, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-300">{stat.label}</h3>
                  <p className="text-sm sm:text-lg font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Win/Loss Visualization */}
          <div className="bg-[#111D38] rounded-xl border border-[#1E2A4A] p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Win/Loss Visualization</h2>
            <div className="h-48 sm:h-64 bg-[#0A1428] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              {isLoading ? (
                <div className="text-center">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2 sm:mb-4"></div>
                  <p className="text-gray-400 text-xs sm:text-sm">Loading win/loss data...</p>
                </div>
              ) : (
                <p className="text-gray-400 text-xs sm:text-sm">Calendar heatmap showing daily prediction accuracy by color intensity</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {marketStats.slice(3).map((stat, index) => (
                <div key={index} className="text-center">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-300">{stat.label}</h3>
                  <p className="text-sm sm:text-lg font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Variable Impact and Correlation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          {/* Variable Impact */}
          <div className="bg-[#111D38] rounded-xl border border-[#1E2A4A] p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Variable Impact</h2>
            <div className="h-48 sm:h-64 bg-[#0A1428] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <p className="text-gray-400 text-xs sm:text-sm">Bar chart showing feature importance by model</p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {variableImpact.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300 text-xs sm:text-sm">{item.variable}</span>
                  <span className="text-white font-medium text-xs sm:text-sm">{item.impact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Correlation Matrix */}
          <div className="bg-[#111D38] rounded-xl border border-[#1E2A4A] p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Correlation Matrix</h2>
            <div className="h-48 sm:h-64 bg-[#0A1428] rounded-lg flex items-center justify-center mb-3 sm:mb-4">
              <p className="text-gray-400 text-xs sm:text-sm">Heatmap showing relationship between input features</p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {correlationData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-300 text-xs sm:text-sm">{item.feature}</span>
                  <span className="text-white font-medium text-xs sm:text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Model Configuration */}
        <div className="bg-[#111D38] rounded-xl border border-[#1E2A4A] p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Model Configuration</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#1E2A4A]">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">Parameter</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">LSTM</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">GRU</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">Prophet</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-gray-300 font-medium text-xs sm:text-sm">Ensemble</th>
                </tr>
              </thead>
              <tbody>
                {modelConfig.map((row, index) => (
                  <tr key={index} className="border-b border-[#1E2A4A] hover:bg-[#1E2A4A]/30">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-white font-medium text-xs sm:text-sm">{row.parameter}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm">{row.LSTM}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm">{row.GRU}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm">{row.Prophet}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-300 text-xs sm:text-sm">{row.Ensemble}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-8">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors text-xs sm:text-sm">
            Save Comparison
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors text-xs sm:text-sm">
            Export Result
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium transition-colors text-xs sm:text-sm">
            Optimize Models
          </button>
        </div>
      </div>

      <AllPageFooter/>
    </>
  );
};

export default Model;