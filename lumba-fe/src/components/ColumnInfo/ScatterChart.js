import React from "react";
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const colors = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#808080",
  "#000000",
];

export default function ScatterChart({ predictedData }) {
  if (!predictedData) {
    return <div className="w-full h-48 bg-blue/10 rounded animate-pulse"></div>;
  }

  const { labels_predicted } = predictedData;

  const labelsFeatures = Object.keys(labels_predicted);
  const features = labelsFeatures.slice(0, labelsFeatures.length - 1);

  const labelsPredicted = predictedData?.labels_predicted?.labels_predicted;
  const length = labelsPredicted?.length;

  const clusters = predictedData?.model?.n_cluster;

  const labelY = features[0];
  const labelX = features[1];

  const datasets = Array.from({ length: clusters }, (_, i) => {
    return {
      label: `Cluster ${i + 1}`,
      data: Array.from({ length }, (_, index) => {
        if (labelsPredicted[index] === i) {
          return {
            x: labels_predicted[features[0]][index],
            y: labels_predicted[features[1]][index],
          };
        }
        return null;
      }).filter((item) => item !== null),
      backgroundColor: colors[i],
    };
  });

  const data = {
    datasets,
  };

  return (
    <div className="relative pb-6">
      <span className="absolute -left-16 inset-y-0 flex items-center rotate-[270deg]">{labelY ?? "Label Y"}</span>
      <span className="absolute bottom-0 inset-x-0 flex justify-center">{labelX ?? "Label X"}</span>
      <Scatter options={options} data={data} />
    </div>
  );
}
