import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Constants
const SYMBOLS = [
  "^NSEI",    // Nifty 50
  "^NSEBANK", // Nifty Bank
  "HDFCBANK.NS",
  "ITC.NS",
  "MARUTI.NS",
  "BAJFINANCE.NS"
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
  }
};

// Performance tuning parameters
const SCROLL_SPEED = 2; // Increased from 1 to 2 (pixels per frame)
const SCROLL_INTERVAL = 16; // ~60fps (reduced from 30ms)
const SCROLL_PAUSE_ON_INTERACTION = 2000; // Reduced from 3000ms
const MANUAL_SCROLL_OFFSET = 300; // Increased from 200px
const RESET_BUFFER = 50; // Pixels before end to trigger reset

const PriceBar = () => {
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const requestRef = useRef(null);
  const lastScrollTime = useRef(performance.now());

  // Memoized stock items with optimized rendering
  const stockItems = useMemo(() => {
    return SYMBOLS.map((symbol) => {
      const stock = STOCK_DATA[symbol];
      if (!stock) return null;

      const isNegative = stock.change.startsWith('-') || stock.changePercent.startsWith('-');
      const changeColor = isNegative ? "text-red-400" : "text-green-400";
      const bgColor = isNegative ? "bg-red-900/30" : "bg-green-900/30";

      return (
        <div
          key={symbol}
          className="flex items-center gap-4 px-6 text-sm border-r border-gray-700 min-w-max"
        >
          <span className="font-bold text-gray-100">{stock.symbol}</span>
          <span className="text-gray-300">{stock.price}</span>
          <div className="flex items-center gap-1">
            <span className={`font-medium ${changeColor}`}>
              {stock.change}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${bgColor} ${changeColor}`}>
              {stock.changePercent}
            </span>
          </div>
        </div>
      );
    }).filter(Boolean);
  }, []);

  // Optimized scroll handler using requestAnimationFrame
  const animateScroll = useCallback((time) => {
    if (!scrollRef.current || isPaused) {
      requestRef.current = null;
      return;
    }

    // Throttle scroll updates based on time
    const deltaTime = time - lastScrollTime.current;
    if (deltaTime >= SCROLL_INTERVAL) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;

      if (scrollLeft >= maxScroll - RESET_BUFFER) {
        scrollRef.current.scrollLeft = 0;
      } else {
        // Adjust speed based on container width for consistency
        const speedFactor = clientWidth > 768 ? 1 : 0.8; // Slower on mobile
        scrollRef.current.scrollLeft += SCROLL_SPEED * speedFactor;
      }
      lastScrollTime.current = time;
    }

    requestRef.current = requestAnimationFrame(animateScroll);
  }, [isPaused]);

  // Start auto-scrolling with optimized timing
  const startScrolling = useCallback(() => {
    if (requestRef.current) return;
    lastScrollTime.current = performance.now();
    requestRef.current = requestAnimationFrame(animateScroll);
  }, [animateScroll]);

  // Stop auto-scrolling
  const stopScrolling = useCallback(() => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
  }, []);

  // Optimized manual scroll handler
  const handleManualScroll = useCallback((direction) => {
    if (!scrollRef.current) return;
    
    setIsPaused(true);
    stopScrolling();
    
    const scrollAmount = direction === "left" ? -MANUAL_SCROLL_OFFSET : MANUAL_SCROLL_OFFSET;
    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth"
    });

    // Use a single timeout with cleanup
    const resumeTimer = setTimeout(() => {
      setIsPaused(false);
      startScrolling();
    }, SCROLL_PAUSE_ON_INTERACTION);

    return () => clearTimeout(resumeTimer);
  }, [startScrolling, stopScrolling]);

  // Event handlers with passive listeners
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
    stopScrolling();
  }, [stopScrolling]);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    startScrolling();
  }, [startScrolling]);

  // Initialize with cleanup
  useEffect(() => {
    startScrolling();
    return () => {
      stopScrolling();
    };
  }, [startScrolling, stopScrolling]);

  // Optimized render with reduced re-renders
  return (
    <div className="w-full top-0 left-0 z-50 bg-gray-900 text-white py-1.5 overflow-hidden fixed shadow-md">
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/80 p-2 hover:bg-gray-800 hidden sm:block"
        onClick={() => handleManualScroll("left")}
        aria-label="Scroll left"
      >
        <ChevronLeft className="text-white w-5 h-5" />
      </button>

      <div
        ref={scrollRef}
        className="flex w-full whitespace-nowrap overflow-x-hidden scroll-smooth will-change-transform"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {stockItems}
        {stockItems} {/* Duplicate for seamless looping */}
      </div>

      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-900/80 p-2 hover:bg-gray-800 hidden sm:block"
        onClick={() => handleManualScroll("right")}
        aria-label="Scroll right"
      >
        <ChevronRight className="text-white w-5 h-5" />
      </button>
    </div>
  );
};

export default React.memo(PriceBar);