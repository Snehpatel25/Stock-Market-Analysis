import React, { useState, useEffect } from "react";
import { 
  ChevronDown, BarChart2, TrendingUp, TrendingDown, Activity, 
  Search, Clock, Calendar, Filter, Star, Bookmark, Share2, 
  AlertCircle, RefreshCw, Download, Settings, MoreHorizontal 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AllPageFooter from "../componants/AllPageFooter"
import AfterLoginHeader from "../componants/AfterLoginHeader";

const News = () => {
  const { isLoggedIn } = useAuth();
  const [timeFilter, setTimeFilter] = useState("Last 24 Hours");
  const [sentimentFilter, setSentimentFilter] = useState("All Sentiment");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedNews, setSavedNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All News");
  const [expandedNewsId, setExpandedNewsId] = useState(null);
  const [selectedSector, setSelectedSector] = useState("All Sectors");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    minSentiment: 0,
    maxSentiment: 100,
    sources: ["Reuters", "Bloomberg", "Wall Street Journal", "Financial Times"],
    impactLevels: ["Very High", "High", "Medium", "Low"]
  });

  // Simulate fetching news data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeFilter, sentimentFilter, searchQuery]);

  const newsItems = [
    {
      id: 1,
      source: "Reuters",
      date: "May 28, 2025",
      time: "09:42 AM",
      title: "Fed Chair Hints at Slower Pace for Rate Hikes",
      content: "Federal Reserve Chair indicated that the central bank might slow the pace of interest rate increases in the coming months, citing improving inflation data and concerns about economic growth. Markets reacted positively to the news, with major indices showing gains.",
      fullContent: "Federal Reserve Chair Jerome Powell indicated in his speech today that the central bank might slow the pace of interest rate increases in the coming months. This shift in policy comes as inflation data shows signs of improvement while concerns about economic growth persist. Powell emphasized that future decisions would remain data-dependent. Market reaction was immediately positive, with the S&P 500 gaining 1.2% and the Nasdaq climbing 1.8% following the announcement. Analysts suggest this could mark a turning point in the Fed's aggressive tightening cycle that began in early 2023.",
      sentiment: "Active",
      sentimentScore: 68,
      impact: "High",
      sector: "Financial",
      tags: ["Inflation Data", "Economic Outlook", "Monitory Policy", "Interest Rate"],
      relatedStocks: ["^GSPC", "^DJI", "^IXIC", "JPM", "GS"],
      relatedCompanies: ["JPMorgan Chase", "Goldman Sachs", "Morgan Stanley"],
      popularity: 87,
      author: "Michael Smith",
      readTime: "3 min read"
    },
    {
      id: 2,
      source: "Bloomberg",
      date: "May 28, 2025",
      time: "11:15 AM",
      title: "Tech Stocks Rally on Positive AI Developments",
      content: "Technology stocks surged today following announcements of breakthrough AI capabilities from several major companies. Semiconductor manufacturers also saw significant gains as demand for AI chips continues to grow.",
      fullContent: "The technology sector experienced a significant rally today after several major companies announced breakthrough developments in artificial intelligence. NVIDIA unveiled its next-generation AI chips with 5x performance improvements, while Google demonstrated new generative AI capabilities in its cloud platform. Semiconductor manufacturers led the gains, with the PHLX Semiconductor Index rising 4.2%. Analysts project that the AI chip market could grow to $120 billion by 2027, representing a compound annual growth rate of 28%. This optimism spread across the tech sector, with the NASDAQ-100 Technology Sector Index closing up 3.1%.",
      sentiment: "Positive",
      sentimentScore: 85,
      impact: "Very High",
      sector: "Technology",
      tags: ["AI innovation", "semiconductor demand", "growth potential", "tech sector"],
      relatedStocks: ["AAPL", "MSFT", "NVDA", "TSM", "AMD", "INTC"],
      relatedCompanies: ["NVIDIA", "Taiwan Semiconductor", "Advanced Micro Devices"],
      popularity: 92,
      author: "Sarah Johnson",
      readTime: "4 min read"
    },
    {
      id: 3,
      source: "Wall Street Journal",
      date: "May 28, 2025",
      time: "02:30 PM",
      title: "Oil Prices Dip Amid Global Growth Concerns",
      content: "Crude oil prices fell by over 2% today as investors weighed concerns about slowing global economic growth and potential reduction in demand.",
      fullContent: "Crude oil prices declined sharply today, with Brent crude falling 2.4% to $78.32 per barrel and West Texas Intermediate dropping 2.7% to $73.45. The sell-off was triggered by new economic data showing slowing manufacturing activity in China and Europe, raising concerns about reduced demand. This decline comes despite ongoing supply constraints from OPEC+ production cuts and continued geopolitical tensions in the Middle East. Energy stocks followed oil prices lower, with the S&P 500 Energy Sector falling 1.8%. Analysts suggest that if recession fears intensify, oil could test support levels not seen since early 2024.",
      sentiment: "Negative",
      sentimentScore: 35,
      impact: "Medium",
      sector: "Energy",
      tags: ["demand forecast", "recession fears", "supply glut", "energy sector"],
      relatedStocks: ["XOM", "CVX", "BP", "SHEL", "OXY"],
      relatedCompanies: ["Exxon Mobil", "Chevron", "BP", "Shell"],
      popularity: 76,
      author: "Robert Chen",
      readTime: "2 min read"
    },
    {
      id: 4,
      source: "Financial Times",
      date: "May 28, 2025",
      time: "10:00 AM",
      title: "Retail Sector Shows Resilience Despite Economic Headwinds",
      content: "Major retail chains reported better-than-expected earnings, suggesting consumer spending remains strong despite inflationary pressures.",
      fullContent: "The retail sector demonstrated surprising resilience this quarter, with Walmart, Target, and Home Depot all reporting earnings that exceeded analyst expectations. Same-store sales growth averaged 4.2% across these retailers, defying predictions of a consumer pullback. This performance suggests that while inflation remains elevated, employment strength and wage growth are supporting consumer spending. The S&P 500 Consumer Discretionary Sector gained 1.5% on the news, with particular strength in home improvement and discount retailers. However, luxury goods retailers showed more mixed results, indicating potential bifurcation in consumer behavior.",
      sentiment: "Positive",
      sentimentScore: 72,
      impact: "Medium",
      sector: "Consumer",
      tags: ["retail earnings", "consumer spending", "inflation", "economic data"],
      relatedStocks: ["WMT", "TGT", "HD", "LOW", "AMZN"],
      relatedCompanies: ["Walmart", "Target", "Home Depot", "Amazon"],
      popularity: 68,
      author: "Emily Wilson",
      readTime: "3 min read"
    },
    {
      id: 5,
      source: "Reuters",
      date: "May 27, 2025",
      time: "04:45 PM",
      title: "Pharma Giant Announces Breakthrough in Alzheimer's Treatment",
      content: "A major pharmaceutical company reported positive Phase 3 trial results for its experimental Alzheimer's drug, sending its shares up 15%.",
      fullContent: "Biogen Inc. announced today that its experimental Alzheimer's treatment, lecanemab, showed statistically significant results in slowing cognitive decline in Phase 3 clinical trials. The drug demonstrated a 27% reduction in disease progression compared to placebo over 18 months. This breakthrough sent Biogen's shares soaring 15% in after-hours trading and lifted the entire biotech sector. Analysts estimate the drug could achieve peak annual sales of $8-10 billion if approved. The news also boosted shares of Eli Lilly, which is developing a competing treatment, as it validates the amyloid-targeting approach to Alzheimer's therapy.",
      sentiment: "Positive",
      sentimentScore: 88,
      impact: "High",
      sector: "Healthcare",
      tags: ["biotech", "pharmaceuticals", "Alzheimer's", "FDA approval"],
      relatedStocks: ["BIIB", "LLY", "ALXN", "REGN"],
      relatedCompanies: ["Biogen", "Eli Lilly", "Regeneron"],
      popularity: 84,
      author: "David Miller",
      readTime: "4 min read"
    }
  ];

  const sectors = ["All Sectors", "Technology", "Financial", "Energy", "Healthcare", "Consumer", "Industrial"];

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "Positive": return "bg-green-500/90";
      case "Negative": return "bg-red-500/90";
      case "Active": return "bg-blue-500/90";
      default: return "bg-gray-500/90";
    }
  };

  const getSentimentTextColor = (sentiment) => {
    switch (sentiment) {
      case "Positive": return "text-green-400";
      case "Negative": return "text-red-400";
      case "Active": return "text-blue-400";
      default: return "text-gray-400";
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case "Very High": return "bg-purple-500/20 text-purple-400 border-purple-500";
      case "High": return "bg-red-500/20 text-red-400 border-red-500";
      case "Medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500";
      case "Low": return "bg-blue-500/20 text-blue-400 border-blue-500";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500";
    }
  };

  const renderSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "Positive": return <TrendingUp size={16} className="text-green-400" />;
      case "Negative": return <TrendingDown size={16} className="text-red-400" />;
      case "Active": return <Activity size={16} className="text-blue-400" />;
      default: return <BarChart2 size={16} className="text-gray-400" />;
    }
  };

  const toggleSaveNews = (newsId) => {
    if (savedNews.includes(newsId)) {
      setSavedNews(savedNews.filter(id => id !== newsId));
    } else {
      setSavedNews([...savedNews, newsId]);
    }
  };

  const toggleExpandNews = (newsId) => {
    if (expandedNewsId === newsId) {
      setExpandedNewsId(null);
    } else {
      setExpandedNewsId(newsId);
    }
  };

  const filteredNews = newsItems.filter(news => {
    // Filter by search query
    const matchesSearch = searchQuery === "" || 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      news.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by sentiment
    const matchesSentiment = sentimentFilter === "All Sentiment" || 
      news.sentiment === sentimentFilter;
    
    // Filter by sector
    const matchesSector = selectedSector === "All Sectors" || 
      news.sector === selectedSector;
    
    // Filter by advanced filters
    const matchesAdvancedFilters = 
      news.sentimentScore >= advancedFilters.minSentiment &&
      news.sentimentScore <= advancedFilters.maxSentiment &&
      advancedFilters.sources.includes(news.source) &&
      advancedFilters.impactLevels.includes(news.impact);
    
    return matchesSearch && matchesSentiment && matchesSector && 
      (!showAdvancedFilters || matchesAdvancedFilters);
  });

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      <AfterLoginHeader/>
      <div className="bg-[#0A1428] min-h-screen text-white px-4 mt-20 sm:px-6 md:px-8 lg:px-16 pt-4 sm:pt-6">
        <main className="mt-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">
                <span className="text-blue-400">News</span> Sentiment Analysis
              </h1>
              <p className="text-gray-300 text-lg">Stay updated with market-moving news and sentiment analysis</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center bg-[#1E2A4A]/50 border border-[#27375E] rounded-lg px-3 py-1">
              <Clock size={18} className="text-blue-400 mr-2" />
              <span className="text-sm">Last updated: Today, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="w-full p-6 rounded-2xl shadow-xl border border-[#1b2e50] bg-[#111D38]/50 mb-8">
            <div className="flex flex-col gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search news by keyword, company, or topic..."
                  className="w-full bg-[#1E2A4A] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-[#27375E]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex gap-3 flex-1">
                  <div className="relative flex items-center flex-1">
                    <select
                      value={sentimentFilter}
                      onChange={(e) => setSentimentFilter(e.target.value)}
                      className="appearance-none bg-[#1E2A4A] text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-[#27375E] w-full"
                    >
                      <option>All Sentiment</option>
                      <option>Positive</option>
                      <option>Negative</option>
                      <option>Neutral</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  
                  <div className="relative flex items-center flex-1">
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="appearance-none bg-[#1E2A4A] text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-[#27375E] w-full"
                    >
                      <option>Last 24 Hours</option>
                      <option>Last Week</option>
                      <option>Last Month</option>
                      <option>Custom Range</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="relative flex items-center flex-1">
                    <select
                      value={selectedSector}
                      onChange={(e) => setSelectedSector(e.target.value)}
                      className="appearance-none bg-[#1E2A4A] text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-[#27375E] w-full"
                    >
                      {sectors.map(sector => (
                        <option key={sector}>{sector}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center bg-[#1E2A4A] hover:bg-[#27375E] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-[#27375E] transition-colors"
                  >
                    <Filter size={16} className="mr-2" />
                    <span>Advanced</span>
                  </button>

                  <button 
                    onClick={refreshData}
                    className="flex items-center bg-[#1E2A4A] hover:bg-[#27375E] text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-[#27375E] transition-colors"
                  >
                    <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {showAdvancedFilters && (
                <div className="mt-4 p-4 rounded-lg bg-[#1E2A4A] border border-[#27375E]">
                  <h4 className="text-lg font-medium mb-3 flex items-center">
                    <Settings size={18} className="mr-2" />
                    Advanced Filters
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Sentiment Range</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={advancedFilters.minSentiment}
                          onChange={(e) => setAdvancedFilters({...advancedFilters, minSentiment: parseInt(e.target.value)})}
                          className="w-full"
                        />
                        <span className="text-sm w-10">{advancedFilters.minSentiment}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={advancedFilters.maxSentiment}
                          onChange={(e) => setAdvancedFilters({...advancedFilters, maxSentiment: parseInt(e.target.value)})}
                          className="w-full"
                        />
                        <span className="text-sm w-10">{advancedFilters.maxSentiment}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Sources</label>
                      <div className="space-y-2">
                        {["Reuters", "Bloomberg", "Wall Street Journal", "Financial Times"].map(source => (
                          <label key={source} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={advancedFilters.sources.includes(source)}
                              onChange={() => {
                                if (advancedFilters.sources.includes(source)) {
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    sources: advancedFilters.sources.filter(s => s !== source)
                                  });
                                } else {
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    sources: [...advancedFilters.sources, source]
                                  });
                                }
                              }}
                              className="mr-2 rounded bg-[#27375E] border-[#1b2e50]"
                            />
                            <span className="text-sm">{source}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Impact Levels</label>
                      <div className="space-y-2">
                        {["Very High", "High", "Medium", "Low"].map(impact => (
                          <label key={impact} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={advancedFilters.impactLevels.includes(impact)}
                              onChange={() => {
                                if (advancedFilters.impactLevels.includes(impact)) {
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    impactLevels: advancedFilters.impactLevels.filter(i => i !== impact)
                                  });
                                } else {
                                  setAdvancedFilters({
                                    ...advancedFilters,
                                    impactLevels: [...advancedFilters.impactLevels, impact]
                                  });
                                }
                              }}
                              className="mr-2 rounded bg-[#27375E] border-[#1b2e50]"
                            />
                            <span className="text-sm">{impact}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-end">
                      <button 
                        onClick={() => setAdvancedFilters({
                          minSentiment: 0,
                          maxSentiment: 100,
                          sources: ["Reuters", "Bloomberg", "Wall Street Journal", "Financial Times"],
                          impactLevels: ["Very High", "High", "Medium", "Low"]
                        })}
                        className="bg-[#27375E] hover:bg-[#1E2A4A] text-white px-4 py-2 rounded text-sm transition-colors"
                      >
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[#1b2e50] mb-6">
            {["All News", "Saved", "Top Stories", "Market Moving"].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium text-sm relative ${activeTab === tab ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Market Sentiment Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-[#101B33] border border-[#1b2e50] shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Market Sentiment</h3>
                <div className="flex items-center bg-[#1E2A4A]/50 px-3 py-1 rounded-full border border-[#27375E]">
                  <Activity size={16} className="text-blue-400 mr-2" />
                  <span className="text-sm">Real-time</span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Positive</span>
                    <span className="text-green-400 font-medium">42%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-300 h-2 rounded-full" 
                      style={{ width: '42%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Negative</span>
                    <span className="text-red-400 font-medium">28%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-300 h-2 rounded-full" 
                      style={{ width: '28%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Neutral</span>
                    <span className="text-blue-400 font-medium">30%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-300 h-2 rounded-full" 
                      style={{ width: '30%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#101B33] border border-[#1b2e50] shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top Sectors</h3>
                <div className="flex items-center bg-[#1E2A4A]/50 px-3 py-1 rounded-full border border-[#27375E]">
                  <TrendingUp size={16} className="text-green-400 mr-2" />
                  <span className="text-sm">Today</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { sector: "Technology", change: "+2.4%", sentiment: "Positive", stocks: ["AAPL", "MSFT", "NVDA"] },
                  { sector: "Healthcare", change: "+1.7%", sentiment: "Positive", stocks: ["PFE", "JNJ", "UNH"] },
                  { sector: "Energy", change: "-1.2%", sentiment: "Negative", stocks: ["XOM", "CVX", "BP"] }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="text-sm">{item.sector}</span>
                      <div className="flex gap-1 mt-1">
                        {item.stocks.map((stock, i) => (
                          <span key={i} className="text-xs bg-[#1E2A4A] text-blue-300 px-1.5 py-0.5 rounded">
                            {stock}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.sentiment === "Positive" ? "bg-green-500/20 text-green-400" : 
                      item.sentiment === "Negative" ? "bg-red-500/20 text-red-400" : 
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {item.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#101B33] border border-[#1b2e50] shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Most Active</h3>
                <div className="flex items-center bg-[#1E2A4A]/50 px-3 py-1 rounded-full border border-[#27375E]">
                  <Activity size={16} className="text-yellow-400 mr-2" />
                  <span className="text-sm">Volume</span>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { stock: "AAPL", price: "$192.34", change: "+1.2%", volume: "42.5M", newsCount: 5 },
                  { stock: "TSLA", price: "$210.78", change: "-0.8%", volume: "38.2M", newsCount: 3 },
                  { stock: "NVDA", price: "$890.21", change: "+3.1%", volume: "35.7M", newsCount: 7 }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.stock}</span>
                    <div className="flex items-center">
                      <span className="text-xs mr-3">{item.price}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.change.startsWith("+") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {item.change}
                      </span>
                      {item.newsCount > 0 && (
                        <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">
                          {item.newsCount} news
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* News List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6 mb-10">
              {filteredNews.map((news) => (
                <div
                  key={news.id}
                  className="group p-6 rounded-xl bg-[#101B33] border border-[#1b2e50] shadow-md hover:shadow-xl transition-all duration-300 hover:border-[#2a3d6b]"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap mb-2 gap-2">
                        <span className="text-sm font-medium text-gray-300">{news.source}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-400">{news.date}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-400">{news.time}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-400">{news.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">{news.title}</h3>
                      <p className="text-gray-300 mb-4">
                        {expandedNewsId === news.id ? news.fullContent : news.content}
                      </p>
                      <button 
                        onClick={() => toggleExpandNews(news.id)}
                        className="text-blue-400 text-sm hover:underline"
                      >
                        {expandedNewsId === news.id ? "Show less" : "Read more"}
                      </button>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <div className={`px-3 py-1.5 rounded-full flex items-center ${getSentimentColor(news.sentiment)}`}>
                        {renderSentimentIcon(news.sentiment)}
                        <span className="ml-2 text-sm font-medium">{news.sentiment}</span>
                        <span className="ml-2 text-sm font-bold">{news.sentimentScore}%</span>
                      </div>
                      
                      <div className={`text-xs px-2 py-1 rounded border ${getImpactColor(news.impact)}`}>
                        Impact: {news.impact}
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => toggleSaveNews(news.id)}
                          className={`p-2 rounded-full ${savedNews.includes(news.id) ? 'text-yellow-400 bg-yellow-500/10' : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'}`}
                        >
                          <Bookmark size={16} fill={savedNews.includes(news.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button className="p-2 rounded-full text-gray-400 hover:text-blue-400 hover:bg-blue-500/10">
                          <Share2 size={16} />
                        </button>
                        <button className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10">
                          <AlertCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-[#1E2A4A] text-gray-300 px-3 py-1 rounded-full border border-[#27375E]">
                        Sector: {news.sector}
                      </span>
                      {news.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-[#1E2A4A] text-gray-300 px-3 py-1 rounded-full border border-[#27375E] hover:bg-[#27375E] transition-colors cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Related Stocks:</span>
                      {news.relatedStocks.map((stock, i) => (
                        <span
                          key={i}
                          className="text-xs bg-[#1E2A4A] text-blue-300 px-2 py-1 rounded hover:bg-[#27375E] transition-colors cursor-pointer"
                        >
                          {stock}
                        </span>
                      ))}
                    </div>
                  </div>

                  {expandedNewsId === news.id && (
                    <div className="mt-4 pt-4 border-t border-[#1b2e50]">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Additional Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Author: <span className="text-gray-300">{news.author}</span></p>
                          <p className="text-sm text-gray-400">Popularity: 
                            <span className="ml-2 text-gray-300">{news.popularity}/100</span>
                            <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full" 
                                style={{ width: `${news.popularity}%` }}
                              ></div>
                            </div>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Related Companies:</p>
                          <div className="flex flex-wrap gap-1">
                            {news.relatedCompanies.map((company, i) => (
                              <span
                                key={i}
                                className="text-xs bg-[#1E2A4A] text-gray-300 px-2 py-1 rounded border border-[#27375E]"
                              >
                                {company}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          
        </main>
      </div>
      <div className="mt-16">
        <AllPageFooter/>
      </div>
    </>
  );
};

export default News;