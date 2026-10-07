import React, { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SYMBOLS = [
  "^NSEI",    // Nifty 50
  "^NSEBANK", // Nifty Bank
  "HDFCBANK.NS",
  "ITC.NS",
  "MARUTI.NS",
  "BAJFINANCE.NS",
  "RELIANCE.NS",
  "TCS.NS",
  "INFY.NS"
];

const STOCK_DATA = {
  "^NSEI": {
    symbol: "NIFTY 50",
    price: "19,425.35",
    change: "+112.35",
    changePercent: "+0.58%"
  },
  "^NSEBANK": {
    symbol: "NIFTY BANK",
    price: "42,532.85",
    change: "+285.50",
    changePercent: "+0.68%"
  },
  "HDFCBANK.NS": {
    symbol: "HDFCBANK",
    price: "1,542.75",
    change: "+12.40",
    changePercent: "+0.81%"
  },
  "ITC.NS": {
    symbol: "ITC",
    price: "445.60",
    change: "+5.25",
    changePercent: "+1.19%"
  },
  "MARUTI.NS": {
    symbol: "MARUTI",
    price: "9,876.50",
    change: "-32.75",
    changePercent: "-0.33%"
  },
  "BAJFINANCE.NS": {
    symbol: "BAJFINANCE",
    price: "7,245.30",
    change: "+45.20",
    changePercent: "+0.63%"
  },
  "RELIANCE.NS": {
    symbol: "RELIANCE",
    price: "2,468.90",
    change: "+18.20",
    changePercent: "+0.74%"
  },
  "TCS.NS": {
    symbol: "TCS",
    price: "3,510.45",
    change: "-14.60",
    changePercent: "-0.41%"
  },
  "INFY.NS": {
    symbol: "INFY",
    price: "1,482.10",
    change: "+22.50",
    changePercent: "+1.54%"
  }
};

const PriceBar = () => {
  const containerRef = useRef(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const stockItemElements = useMemo(() => {
    return SYMBOLS.map((symbol) => {
      const stock = STOCK_DATA[symbol];
      if (!stock) return null;

      const isNegative = stock.change.startsWith("-") || stock.changePercent.startsWith("-");
      const changeColor = isNegative ? "text-red-400" : "text-green-400";
      const bgColor = isNegative ? "bg-red-900/30" : "bg-green-900/30";

      return (
        <div
          key={symbol}
          className="flex items-center gap-3 px-6 text-sm border-r border-gray-800 shrink-0 select-none"
        >
          <span className="font-bold text-gray-100 tracking-wide">{stock.symbol}</span>
          <span className="text-gray-300 font-mono">₹{stock.price}</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className={`font-semibold text-xs ${changeColor}`}>
              {stock.change}
            </span>
            <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${bgColor} ${changeColor}`}>
              {stock.changePercent}
            </span>
          </div>
        </div>
      );
    }).filter(Boolean);
  }, []);

  const handleManualScroll = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    containerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <div className="w-full top-0 left-0 z-50 bg-[#0d1522]/95 backdrop-blur-md border-b border-gray-800/80 text-white py-2 overflow-hidden fixed shadow-lg">
      {/* Left button */}
      <button
        className="absolute left-0 top-0 bottom-0 z-20 bg-gradient-to-r from-[#0d1522] via-[#0d1522]/90 to-transparent px-2.5 flex items-center justify-center hover:text-cyan-400 transition-colors hidden sm:flex"
        onClick={() => handleManualScroll("left")}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5 drop-shadow" />
      </button>

      {/* Ticker track */}
      <div
        ref={containerRef}
        className="flex w-full overflow-x-hidden no-scrollbar"
      >
        <div className="animate-ticker flex shrink-0">
          {stockItemElements}
          {stockItemElements}
        </div>
        <div className="animate-ticker flex shrink-0" aria-hidden="true">
          {stockItemElements}
          {stockItemElements}
        </div>
      </div>

      {/* Right button */}
      <button
        className="absolute right-0 top-0 bottom-0 z-20 bg-gradient-to-l from-[#0d1522] via-[#0d1522]/90 to-transparent px-2.5 flex items-center justify-center hover:text-cyan-400 transition-colors hidden sm:flex"
        onClick={() => handleManualScroll("right")}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5 drop-shadow" />
      </button>
    </div>
  );
};

export default React.memo(PriceBar);