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

// Register the necessary Chart.js components for rendering the line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * The props for the Sparkline component.
 *
 * @typedef {Object} SparklineProps
 * @property {number[]} data - An array of numbers representing the data points to be plotted on the sparkline.
 * @property {number} change - A numerical value representing the percentage change; used to determine the color of the line.
 */

/**
 * Sparkline is a React component that renders a simple line chart (sparkline) using Chart.js.
 *
 * @param {SparklineProps} props - The props for the Sparkline component.
 * @returns {JSX.Element | null} A JSX element rendering the Line chart, or null if no data is provided.
 */
const Sparkline = ({ data, change }) => {
  // Return null if no data is provided
  if (!data || data.length === 0) {
    return null;
  }

  // Determine the line color based on the change value
  const borderColor = change > 0 ? "green" : change < 0 ? "red" : "gray";

  // Prepare the chart data for rendering
  const chartData = {
    labels: data.map((_, index) => index), // Generate labels based on the data index
    datasets: [
      {
        data: data,
        borderColor: borderColor, // Set the line color
        borderWidth: 2, // Set the width of the line
      },
    ],
  };

  return (
    <Line
      data={chartData}
      options={{
        responsive: true,
        maintainAspectRatio: false, // Disable aspect ratio for flexibility
        scales: {
          x: { display: false }, // Hide the x-axis
          y: { display: false }, // Hide the y-axis
        },
        elements: { point: { radius: 0 } }, // Remove points from the line
        plugins: {
          legend: { display: false }, // Hide the chart legend
          tooltip: { enabled: false }, // Disable tooltips
        },
      }}
      height={50} // Set a fixed height for the chart
      width={150} // Set a fixed width for the chart
    />
  );
};

export default Sparkline;
