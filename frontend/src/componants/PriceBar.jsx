import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SYMBOLS = [
  "^NSEI",    // Nifty 50
  "^NSEBANK", // Nifty Bank
  "HDFCBANK.NS",
  "ITC.NS",
  "MARUTI.NS",
  "BAJFINANCE.NS"
];

// Static data with latest values
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
  }
};

const PriceBar = () => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const isScrollingRef = useRef(false);

  const startScrolling = useCallback(() => {
    if (isScrollingRef.current || !scrollRef.current) return;
    isScrollingRef.current = true;

    const scroll = () => {
      if (!scrollRef.current) return;

      scrollRef.current.scrollLeft += 2; // <-- Increased speed here!

      if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
        scrollRef.current.scrollLeft = 0;
      }

      animationRef.current = requestAnimationFrame(scroll);
    };

    animationRef.current = requestAnimationFrame(scroll);
  }, []);

  const stopScrolling = useCallback(() => {
    isScrollingRef.current = false;
    cancelAnimationFrame(animationRef.current);
  }, []);

  const handleScroll = (direction) => {
    stopScrolling();
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth"
      });
    }
    setTimeout(startScrolling, 3000);
  };

  useEffect(() => {
    startScrolling();
    return () => stopScrolling();
  }, [startScrolling, stopScrolling]);

  const stockItems = useMemo(() => {
    return SYMBOLS.map((symbol, index) => {
      const stock = STOCK_DATA[symbol];
      if (!stock) return null;

      const change = stock.change || "0.00";
      const changePercent = stock.changePercent || "0.00%";
      const isNegative = String(change).startsWith('-') || 
                         String(changePercent).startsWith('-');

      return (
        <div
          key={`${symbol}-${index}`}
          className="flex items-center gap-4 px-6 text-sm border-r border-gray-700 min-w-max"
        >
          <span className="font-bold text-gray-100">{stock.symbol}</span>
          <span className="text-gray-300">{stock.price}</span>
          <div className="flex items-center gap-1">
            <span className={`font-medium ${isNegative ? "text-red-400" : "text-green-400"}`}>
              {change}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              isNegative ? "bg-red-900/30 text-red-400" : "bg-green-900/30 text-green-400"
            }`}>
              {changePercent}
            </span>
          </div>
        </div>
      );
    }).filter(Boolean);
  }, []);

  const duplicatedStockItems = useMemo(() => {
    return stockItems.concat(stockItems.map((item, index) => {
      if (!item) return null;
      return React.cloneElement(item, {
        key: `${item.key}-copy-${index}`,
        className: item.props.className
      });
    }).filter(Boolean));
  }, [stockItems]);

  return (
    <div className="w-full top-0 left-0 z-50 bg-gray-900 text-white py-1.5 overflow-hidden fixed shadow-md">
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/80 p-2 hover:bg-gray-800 hidden sm:block"
        onClick={() => handleScroll("left")}
        aria-label="Scroll left"
      >
        <ChevronLeft className="text-white w-5 h-5" />
      </button>

      <div
        ref={scrollRef}
        className="flex w-full whitespace-nowrap overflow-x-hidden scroll-smooth"
        onMouseEnter={stopScrolling}
        onMouseLeave={startScrolling}
      >
        {duplicatedStockItems}
      </div>

      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/80 p-2 hover:bg-gray-800 hidden sm:block"
        onClick={() => handleScroll("right")}
        aria-label="Scroll right"
      >
        <ChevronRight className="text-white w-5 h-5" />
      </button>
    </div>
  );
};

export default PriceBar;
