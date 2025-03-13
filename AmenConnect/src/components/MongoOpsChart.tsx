import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MongoOpsBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: "Read Operations",
        data: [] as number[],
        backgroundColor: "rgba(75,192,192,0.5)",
      },
      {
        label: "Write Operations",
        data: [] as number[],
        backgroundColor: "rgba(153,102,255,0.5)",
      },
    ],
  });

  useEffect(() => {
    const updateMongoOpsData = async () => {
      try {
        // Call your API endpoint that returns your MongoDB operations metrics
        const response = await fetch("/api/mongo-ops");
        if (!response.ok) {
          throw new Error("Failed to fetch MongoDB operations");
        }
        const data = await response.json();
        // Expected data format: { time: "HH:MM:SS", readOps: number, writeOps: number }
        setChartData((prevData) => {
          const newLabels = [...prevData.labels, data.time];
          const newReadData = [...prevData.datasets[0].data, data.readOps];
          const newWriteData = [...prevData.datasets[1].data, data.writeOps];

          // Keep only the latest 10 data points
          return {
            labels: newLabels.slice(-10),
            datasets: [
              { ...prevData.datasets[0], data: newReadData.slice(-10) },
              { ...prevData.datasets[1], data: newWriteData.slice(-10) },
            ],
          };
        });
      } catch (error) {
        console.error("Error fetching MongoDB operations:", error);
      }
    };

    // Fetch initial data and then update periodically
    updateMongoOpsData();
    const interval = setInterval(updateMongoOpsData, 5000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: { size: 12, weight: 500 },
          color: "#64748b",
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#1e293b",
        bodyColor: "#475569",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          maxRotation: 0,
          maxTicksLimit: 5,
        },
      },
      y: {
        min: 0,
        grid: { color: "rgba(226, 232, 240, 0.5)" },
        ticks: {
          color: "#94a3b8",
          font: { size: 11 },
          padding: 8,
          stepSize: 10,
        },
      },
    },
    interaction: { mode: "index" as const, intersect: false },
    animation: { duration: 800 },
  };

  return (
    <div className="mongo-ops-chart-container" style={{ height: "300px", width:"1100px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MongoOpsBarChart;
