import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // ADD THIS

const options = {
  plugins: {
    legend: {
      display: true,
      position: "bottom",
    },
    tooltip: {
      enabled: true,
    },
    responsive: true,
  },
};

export default function BarChart({ label, labels, data }) {
  const ref = useRef(null);

  const generateData = () => {
    return {
      labels: labels,
      datasets: [
        {
          label: label,
          data: data,
          backgroundColor: ({ chart: { ctx } }) => {
            const bg = ctx.createLinearGradient(0, 0, 0, 200);
            bg.addColorStop(0, "rgb(102, 125, 233)");
            bg.addColorStop(1, "rgb(118, 76, 163)");

            return bg;
          },
        },
      ],
    };
  };

  return (
    <div className="relative">
      <Bar ref={ref} data={generateData()} options={options} width={400} height={200} />
      <span className="absolute bottom-2 bg-white w-full text-center">{label}</span>
    </div>
  );
}
