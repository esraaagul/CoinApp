import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SparklineProps {
  data: number[];
  change: number;
}

const Sparkline: React.FC<SparklineProps> = ({ data, change }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const borderColor = change > 0 ? "green" : change < 0 ? "red" : "gray";

  const chartData = {
    labels: data.map((_, index) => index.toString()), // Convert index to string
    datasets: [
      {
        data: data,
        borderColor: borderColor,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false },
        },
        elements: { point: { radius: 0 } },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      }}
      height={50}
      width={150}
    />
  );
};

export default Sparkline;
