import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const StockChart = () => {
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Stock Value",
        data: [25000, 25100, 25200, 25300, 25050],
        borderColor: "#4ade80",
        backgroundColor: "rgba(74,222,128,0.1)",
        pointRadius: 0,
        tension: 1,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          font: {
            size: 10,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#94a3b8",
          font: {
            size: 10,
          },
        },
        grid: {
          color: "#1e293b",
        },
      },
    },
  };

  return (
    <div className="h-20 w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default StockChart;
