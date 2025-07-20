import React, { useState, useEffect } from 'react';
import { Search, Bell, X, ChevronDown, Plus, Star, Download, MessageSquare, ChevronUp } from 'lucide-react';
import AllPageFooter from '../componants/AllPageFooter';
import AfterLoginHeader from '../componants/AfterLoginHeader';

const Alerts = () => {
  const [activeTab, setActiveTab] = useState('Alerts');
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [newAlert, setNewAlert] = useState({
    stock: '',
    type: 'Price',
    condition: 'Above',
    value: '',
    notificationType: 'In-App'
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const initialTriggeredAlerts = [
    { id: 1, stock: 'AAPL', message: 'Price dropped below ₹120.00', price: '₹113.15', change: '+5.7%', time: 'Today, 10:20 AM', details: 'Apple stock has dropped below your threshold of ₹120.00. Current price is ₹113.15.' },
    { id: 2, stock: 'TSLA', message: 'AI Model predicts 5% rise', price: '₹156.36', change: '+2.5%', time: 'Today, 09:45 AM', details: 'Our AI model predicts a 5% rise in Tesla stock within the next 24 hours based on recent patterns.' },
    { id: 3, stock: 'MSFT', message: 'Volume spike detected', price: '₹320.54', change: '+2.4%', time: 'Today, 08:30 AM', details: 'Unusual trading volume detected for Microsoft. Current volume is 2.5x the 30-day average.' },
    { id: 4, stock: 'NVDA', message: 'Price crossed ₹950.00', price: '₹962.50', change: '+3.2%', time: 'Yesterday, 3:15 PM', details: 'NVIDIA stock has crossed your target price of ₹950.00. Current price is ₹962.50.' },
    { id: 5, stock: 'AMZN', message: 'RSI below 30 (Oversold)', price: '₹182.75', change: '-0.5%', time: 'Yesterday, 11:20 AM', details: 'Amazon stock RSI has dropped below 30, indicating it may be oversold based on technical indicators.' }
  ];

  const initialMyAlerts = [
    { id: 1, stock: 'AAPL', condition: 'Price dropped below ₹120.00', status: 'Triggered', triggerPrice: '₹120.00', created: '2 days ago', type: 'Price' },
    { id: 2, stock: 'NVDA', condition: 'Price rises above ₹950.00', status: 'Active', triggerPrice: '₹950.00', created: '1 week ago', type: 'Price' },
    { id: 3, stock: 'TSLA', condition: 'AI Model predicts 5% rise', status: 'Active', triggerPrice: 'N/A', created: '3 days ago', type: 'AI Prediction' },
    { id: 4, stock: 'AMZN', condition: 'Price drops below ₹180.00', status: 'Active', triggerPrice: '₹180.00', created: '5 days ago', type: 'Price' },
    { id: 5, stock: 'MSFT', condition: 'Volume spike detected', status: 'Triggered', triggerPrice: 'N/A', created: '1 day ago', type: 'Volume' },
    { id: 6, stock: 'GOOGL', condition: 'RSI above 70 (Overbought)', status: 'Active', triggerPrice: 'N/A', created: '4 days ago', type: 'Technical' }
  ];

  const initialWatchlist = [
    { id: 1, symbol: 'AAPL', name: 'Apple Inc.', price: '₹189.75', change: '-1.2%', marketCap: '₹2.8T', sector: 'Technology', added: '3 days ago' },
    { id: 2, symbol: 'MSFT', name: 'Microsoft Corp.', price: '₹415.45', change: '+2.3%', marketCap: '₹3.1T', sector: 'Technology', added: '1 week ago' },
    { id: 3, symbol: 'NVDA', name: 'NVIDIA Corporation', price: '₹942.89', change: '+1.8%', marketCap: '₹2.3T', sector: 'Semiconductors', added: '2 days ago' },
    { id: 4, symbol: 'TSLA', name: 'Tesla, Inc.', price: '₹215.32', change: '+0.6%', marketCap: '₹690B', sector: 'Automotive', added: '5 days ago' },
    { id: 5, symbol: 'AMZN', name: 'Amazon.com, Inc.', price: '₹182.75', change: '-0.5%', marketCap: '₹1.8T', sector: 'E-Commerce', added: '1 week ago' },
    { id: 6, symbol: 'GOOGL', name: 'Alphabet Inc.', price: '₹176.23', change: '+0.3%', marketCap: '₹2.2T', sector: 'Technology', added: '4 days ago' },
    { id: 7, symbol: 'META', name: 'Meta Platforms, Inc.', price: '₹478.22', change: '+1.2%', marketCap: '₹1.2T', sector: 'Technology', added: '3 days ago' },
    { id: 8, symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: '₹198.34', change: '-0.8%', marketCap: '₹570B', sector: 'Financial', added: '2 weeks ago' },
    { id: 9, symbol: 'WMT', name: 'Walmart Inc.', price: '₹65.28', change: '+0.4%', marketCap: '₹440B', sector: 'Retail', added: '1 week ago' }
  ];

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('myAlerts');
    return saved ? JSON.parse(saved) : initialMyAlerts;
  });

  const [activeAlerts, setActiveAlerts] = useState(() => {
    const saved = localStorage.getItem('triggeredAlerts');
    return saved ? JSON.parse(saved) : initialTriggeredAlerts;
  });

  const [myWatchlist, setMyWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : initialWatchlist;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [newStock, setNewStock] = useState({
    symbol: '',
    name: '',
    price: '',
    change: ''
  });

  useEffect(() => {
    localStorage.setItem('myAlerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('triggeredAlerts', JSON.stringify(activeAlerts));
  }, [activeAlerts]);

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(myWatchlist));
  }, [myWatchlist]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreateAlert = () => {
    if (!newAlert.stock || !newAlert.value) return;
    
    const newAlertItem = {
      id: Date.now(), 
      stock: newAlert.stock.toUpperCase(),
      condition: `${newAlert.type} ${newAlert.condition} ₹${newAlert.value}`,
      status: 'Active',
      triggerPrice: `₹${newAlert.value}`,
      created: 'Just now',
      type: newAlert.type,
      notificationType: newAlert.notificationType
    };
    
    setAlerts([...alerts, newAlertItem]);
    setShowCreateAlert(false);
    setNewAlert({ 
      stock: '', 
      type: 'Price', 
      condition: 'Above', 
      value: '',
      notificationType: 'In-App'
    });
  };

  const dismissAlert = (id) => {
    setActiveAlerts(activeAlerts.filter(alert => alert.id !== id));
  };

  const dismissAllAlerts = () => {
    setActiveAlerts([]);
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlertStatus = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id 
        ? { ...alert, status: alert.status === 'Active' ? 'Paused' : 'Active' } 
        : alert
    ));
  };

  const removeFromWatchlist = (id) => {
    setMyWatchlist(myWatchlist.filter(item => item.id !== id));
  };

  const addToWatchlist = () => {
    if (!newStock.symbol || !newStock.name) return;
    
    const newWatchlistItem = {
      id: Date.now(),
      symbol: newStock.symbol.toUpperCase(),
      name: newStock.name,
      price: newStock.price || '₹0.00',
      change: newStock.change || '0.0%',
      marketCap: 'N/A',
      sector: 'N/A',
      added: 'Just now'
    };
    
    setMyWatchlist([...myWatchlist, newWatchlistItem]);
    setShowAddStockModal(false);
    setNewStock({
      symbol: '',
      name: '',
      price: '',
      change: ''
    });
  };

  const filteredWatchlist = myWatchlist.filter(item =>
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedItems = (items) => {
    if (!sortConfig.key) return items;
    
    return [...items].sort((a, b) => {
      const extractNumber = (str) => parseFloat(str.replace(/[^0-9.-]/g, ''));
      
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      if (sortConfig.key === 'price' || sortConfig.key === 'triggerPrice') {
        aValue = extractNumber(aValue);
        bValue = extractNumber(bValue);
      } else if (sortConfig.key === 'change') {
        aValue = extractNumber(aValue.replace('%', ''));
        bValue = extractNumber(bValue.replace('%', ''));
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const toggleAlertDetails = (id) => {
    setExpandedAlert(expandedAlert === id ? null : id);
  };

  return (
    <><AfterLoginHeader />
      <div className="bg-[#0A1428] min-h-screen text-white px-4 sm:px-6 md:px-8 lg:px-16 pt-4 mt-20 sm:pt-6">
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
                <span className="text-blue-400">Alerts</span> & Watchlist
              </h1>
              <p className="text-gray-300 text-sm sm:text-lg">Manage your stock alerts and watchlist</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('Alerts')}
                className={`flex-1 md:flex-none px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${activeTab === 'Alerts' ? 'bg-blue-500' : 'bg-[#1E2A4A] border border-[#27375E]'}`}
              >
                Alerts
              </button>
              <button
                onClick={() => setActiveTab('Watchlist')}
                className={`flex-1 md:flex-none px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${activeTab === 'Watchlist' ? 'bg-blue-500' : 'bg-[#1E2A4A] border border-[#27375E]'}`}
              >
                Watchlist
              </button>
            </div>
          </div>

          {activeTab === 'Alerts' ? (
            <div className="space-y-6">
              {/* Recently Triggered Alerts - Enhanced with more features */}
              <div className="bg-[#101B33] border border-[#1b2e50] rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold">Recently Triggered Alerts ({activeAlerts.length})</h2>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {activeAlerts.length > 0 && (
                      <button 
                        onClick={dismissAllAlerts}
                        className="text-xs sm:text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Dismiss All
                      </button>
                    )}
                    <button className="text-blue-400 text-xs sm:text-sm flex items-center bg-[#1E2A4A] hover:bg-[#27375E] px-3 py-1.5 rounded-lg border border-[#27375E] transition-colors">
                      View All <ChevronDown className="inline ml-1" size={16} />
                    </button>
                  </div>
                </div>

                {activeAlerts.length === 0 ? (
                  <div className="bg-[#1E2A4A] p-6 rounded-lg text-center text-gray-400">
                    <Bell size={32} className="mx-auto mb-3 text-blue-400" />
                    <p>No triggered alerts yet. Create alerts to monitor your stocks.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeAlerts.map(alert => (
                      <div key={alert.id} className="bg-[#1E2A4A] p-4 rounded-lg hover:bg-[#27375E] transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-bold text-lg">{alert.stock}</div>
                            <div className="text-gray-300 text-sm">{alert.message}</div>
                            <div className="text-xs text-gray-400 mt-1">{alert.time}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{alert.price}</div>
                            <div className={`text-sm ${alert.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                              {alert.change}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-[#27375E]">
                          <button 
                            onClick={() => toggleAlertDetails(alert.id)}
                            className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300"
                          >
                            {expandedAlert === alert.id ? (
                              <>
                                <ChevronUp size={14} /> Hide details
                              </>
                            ) : (
                              <>
                                <ChevronDown size={14} /> Show details
                              </>
                            )}
                          </button>
                          
                          {expandedAlert === alert.id && (
                            <div className="mt-2 text-sm text-gray-300 bg-[#0f172a] p-3 rounded-lg">
                              <p className="mb-2">{alert.details}</p>
                              <div className="flex gap-2 justify-end">
                                <button className="text-blue-400 text-xs border border-blue-400 px-2 py-1 rounded hover:bg-blue-500/10 transition-colors">
                                  View Stock
                                </button>
                                <button
                                  className="text-gray-400 hover:text-white transition-colors text-xs border border-gray-600 px-2 py-1 rounded hover:bg-gray-700"
                                  onClick={() => dismissAlert(alert.id)}
                                >
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#101B33] border border-[#1b2e50] rounded-xl p-4 sm:p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold">My Alerts ({alerts.length})</h2>
                  <button
                    onClick={() => setShowCreateAlert(true)}
                    className="bg-blue-500 hover:bg-blue-600 px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-sm flex items-center transition-colors w-full sm:w-auto justify-center"
                  >
                    <Plus size={16} className="mr-2" /> Create Alert
                  </button>
                </div>

                {alerts.length === 0 ? (
                  <div className="bg-[#1E2A4A] p-6 rounded-lg text-center text-gray-400">
                    <Bell size={32} className="mx-auto mb-3 text-blue-400" />
                    <p>You don't have any alerts yet. Create one to monitor your stocks.</p>
                    <button
                      onClick={() => setShowCreateAlert(true)}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm flex items-center transition-colors mx-auto"
                    >
                      <Plus size={16} className="mr-2" /> Create Your First Alert
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-gray-400 text-left border-b border-[#1b2e50]">
                          <th 
                            className="pb-3 font-medium cursor-pointer hover:text-white"
                            onClick={() => requestSort('stock')}
                          >
                            Stock {sortConfig.key === 'stock' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </th>
                          {!isMobile && (
                            <th 
                              className="pb-3 font-medium cursor-pointer hover:text-white"
                              onClick={() => requestSort('type')}
                            >
                              Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                            </th>
                          )}
                          <th className="pb-3 font-medium">Condition</th>
                          <th 
                            className="pb-3 font-medium cursor-pointer hover:text-white"
                            onClick={() => requestSort('status')}
                          >
                            Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </th>
                          <th className="pb-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSortedItems(alerts).map(alert => (
                          <tr key={alert.id} className="border-b border-[#1b2e50] hover:bg-[#1E2A4A]/50 transition-colors">
                            <td className="py-3 font-medium">
                              <div className="flex items-center gap-2">
                                {alert.stock}
                                {alert.status === 'Triggered' && (
                                  <span className="animate-pulse bg-red-500 rounded-full w-2 h-2"></span>
                                )}
                              </div>
                              {isMobile && (
                                <div className="text-xs text-gray-400 mt-1">{alert.type}</div>
                              )}
                            </td>
                            {!isMobile && (
                              <td className="py-3 text-gray-300">{alert.type}</td>
                            )}
                            <td className="py-3 text-gray-300">
                              <div>{alert.condition}</div>
                              {isMobile && alert.triggerPrice !== 'N/A' && (
                                <div className="text-xs text-gray-400 mt-1">Trigger: {alert.triggerPrice}</div>
                              )}
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${alert.status === 'Triggered' ? 'bg-green-500/20 text-green-400' : alert.status === 'Paused' ? 'bg-gray-500/20 text-gray-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                {alert.status}
                              </span>
                              {isMobile && (
                                <div className="text-xs text-gray-400 mt-1">{alert.created}</div>
                              )}
                            </td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleAlertStatus(alert.id)}
                                  className={`text-xs px-2 py-1 rounded ${alert.status === 'Paused' ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'}`}
                                >
                                  {alert.status === 'Paused' ? 'Activate' : 'Pause'}
                                </button>
                                <button
                                  className="text-gray-400 hover:text-red-400 transition-colors"
                                  onClick={() => removeAlert(alert.id)}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#101B33] border border-[#1b2e50] rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <h2 className="text-lg sm:text-xl font-semibold">My Watchlist ({myWatchlist.length})</h2>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-48">
                    <input
                      type="text"
                      placeholder="Search stocks..."
                      className="bg-[#1E2A4A] text-white rounded-lg pl-10 pr-4 py-2 text-sm border border-[#27375E] focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                  <button 
                    onClick={() => setShowAddStockModal(true)}
                    className="text-blue-400 text-sm flex items-center bg-[#1E2A4A] hover:bg-[#27375E] px-3 py-2 rounded-lg border border-[#27375E] transition-colors w-full sm:w-auto justify-center"
                  >
                    <Plus size={16} className="mr-2" /> Add Stock
                  </button>
                </div>
              </div>

              {filteredWatchlist.length === 0 ? (
                <div className="bg-[#1E2A4A] p-6 rounded-lg text-center text-gray-400">
                  <Star size={32} className="mx-auto mb-3 text-blue-400" />
                  <p>{searchTerm ? 'No stocks match your search' : 'Your watchlist is empty'}</p>
                  <button 
                    onClick={() => setShowAddStockModal(true)}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm flex items-center transition-colors mx-auto"
                  >
                    <Plus size={16} className="mr-2" /> Add Your First Stock
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-gray-400 text-left border-b border-[#1b2e50]">
                        <th 
                          className="pb-3 font-medium cursor-pointer hover:text-white"
                          onClick={() => requestSort('symbol')}
                        >
                          Stock {sortConfig.key === 'symbol' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        {!isMobile && (
                          <th className="pb-3 font-medium">Name</th>
                        )}
                        <th 
                          className="pb-3 font-medium cursor-pointer hover:text-white"
                          onClick={() => requestSort('price')}
                        >
                          Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          className="pb-3 font-medium cursor-pointer hover:text-white"
                          onClick={() => requestSort('change')}
                        >
                          Change {sortConfig.key === 'change' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        {!isMobile && (
                          <th className="pb-3 font-medium">Market Cap</th>
                        )}
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedItems(filteredWatchlist).map(stock => (
                        <tr key={stock.id} className="border-b border-[#1b2e50] hover:bg-[#1E2A4A]/50 transition-colors">
                          <td className="py-3">
                            <div className="font-bold">{stock.symbol}</div>
                            {isMobile && (
                              <div className="text-xs text-gray-400">{stock.name}</div>
                            )}
                          </td>
                          {!isMobile && (
                            <td className="py-3 text-gray-300">{stock.name}</td>
                          )}
                          <td className="py-3 font-medium">{stock.price}</td>
                          <td className={`py-3 font-medium ${stock.change.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                            {stock.change}
                          </td>
                          {!isMobile && (
                            <td className="py-3 text-gray-300">{stock.marketCap}</td>
                          )}
                          <td className="py-3">
                            <div className="flex gap-3">
                              <button 
                                onClick={() => {
                                  setNewAlert({
                                    ...newAlert,
                                    stock: stock.symbol,
                                    value: stock.price.replace(/[^0-9.]/g, '')
                                  });
                                  setShowCreateAlert(true);
                                }}
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                                title="Create Alert"
                              >
                                <Bell size={18} />
                              </button>
                              <button
                                className="text-gray-400 hover:text-red-400 transition-colors"
                                onClick={() => removeFromWatchlist(stock.id)}
                                title="Remove"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {showCreateAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#101B33] border border-[#1b2e50] rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Create New Alert</h3>
                <button 
                  onClick={() => setShowCreateAlert(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Stock Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g. AAPL"
                    className="w-full bg-[#1E2A4A] rounded-lg px-4 py-3 border border-[#27375E] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={newAlert.stock}
                    onChange={(e) => setNewAlert({ ...newAlert, stock: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Alert Type</label>
                    <select
                      className="w-full bg-[#1E2A4A] rounded-lg px-4 py-3 border border-[#27375E] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      value={newAlert.type}
                      onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                    >
                      <option>Price</option>
                      <option>Volume</option>
                      <option>Percentage</option>
                      <option>RSI</option>
                      <option>MACD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Condition</label>
                    <select
                      className="w-full bg-[#1E2A4A] rounded-lg px-4 py-3 border border-[#27375E] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      value={newAlert.condition}
                      onChange={(e) => setNewAlert({ ...newAlert, condition: e.target.value })}
                    >
                      <option>Above</option>
                      <option>Below</option>
                      <option>Equals</option>
                      <option>Crosses</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Value</label>
                  <input
                    type="text"
                    placeholder={newAlert.type === 'Price' ? 'e.g. 200.00' : newAlert.type === 'Percentage' ? 'e.g. 5.0' : 'e.g. 5000000'}
                    className="w-full bg-[#1E2A4A] rounded-lg px-4 py-3 border border-[#27375E] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={newAlert.value}
                    onChange={(e) => setNewAlert({ ...newAlert, value: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Notification Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setNewAlert({...newAlert, notificationType: 'In-App'})}
                      className={`px-4 py-2 rounded-lg border ${newAlert.notificationType === 'In-App' ? 'border-blue-500 bg-blue-500/20' : 'border-[#1b2e50] bg-[#1E2A4A]'}`}
                    >
                      In-App
                    </button>
                    <button
                      onClick={() => setNewAlert({...newAlert, notificationType: 'Email'})}
                      className={`px-4 py-2 rounded-lg border ${newAlert.notificationType === 'Email' ? 'border-blue-500 bg-blue-500/20' : 'border-[#1b2e50] bg-[#1E2A4A]'}`}
                    >
                      Email
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateAlert(false)}
                    className="px-4 py-2 rounded-lg border border-[#1b2e50] bg-[#1E2A4A] hover:bg-[#27375E] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAlert}
                    disabled={!newAlert.stock || !newAlert.value}
                    className={`px-4 py-2 rounded-lg transition-colors ${!newAlert.stock || !newAlert.value ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    Create Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddStockModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#101B33] border border-[#1b2e50] rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Add Stock to Watchlist</h3>
                <button 
                  onClick={() => setShowAddStockModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Stock Symbol</label>
                  <input
                    type="text"
                    placeholder="e.g. AAPL"
                    className="w-full bg-[#1E2A4A] rounded-lg px-4 py-3 border border-[#27375E] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={newStock.symbol}
                    onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apple Inc."
                    className="w-full bg-[#1E2A4A] rounded-lg px-4 py-3 border border-[#27375E] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={newStock.name}
                    onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Current Price</label>
                    <input
                      type="text"
                      placeholder="e.g. 189.75"
                      className="w-full bg-[#1E2A4A] rounded-lg px-4 py-3 border border-[#27375E] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      value={newStock.price}
                      onChange={(e) => setNewStock({ ...newStock, price: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Daily Change</label>
                    <input
                      type="text"
                      placeholder="e.g. +1.2%"
                      className="w-full bg-[#1E2A4A] rounded-lg px-4 py-3 border border-[#27375E] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      value={newStock.change}
                      onChange={(e) => setNewStock({ ...newStock, change: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowAddStockModal(false)}
                    className="px-4 py-2 rounded-lg border border-[#1b2e50] bg-[#1E2A4A] hover:bg-[#27375E] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addToWatchlist}
                    disabled={!newStock.symbol || !newStock.name}
                    className={`px-4 py-2 rounded-lg transition-colors ${!newStock.symbol || !newStock.name ? 'bg-blue-500/50 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                  >
                    Add Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-16">
        <AllPageFooter />
      </div>
    </>
  );
};

export default Alerts;