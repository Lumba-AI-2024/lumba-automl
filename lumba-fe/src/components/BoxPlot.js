import { Chart, LinearScale, CategoryScale } from "chart.js";
import { BoxPlotChart, BoxPlotController, BoxAndWiskers } from "@sgratzl/chartjs-chart-boxplot";
import * as React from "react";

function BoxPlot({ boxplotDatas }) {
  const canvasRef = React.useRef();

  const { labels, data } = boxplotDatas;

  const newLabels = labels.map((label) => label.split(/(?=[A-Z])/).join(" "));
  const axis = newLabels.length > 5 ? "y" : "x";

  const boxplotData = {
    labels: newLabels,
    datasets: [
      {
        type: "boxplot",
        backgroundColor: "rgba(33,210,230,0.7)",
        borderColor: "rgba(60,183,242,1)",
        borderWidth: 1,
        outlierColor: "#999999",
        itemRadius: 0,
        data: data.map((d) => ({
          min: d.min_whisker,
          max: d.max_whisker,
          q1: d.q1,
          q3: d.q3,
          median: d.median,
          mean: d.mean,
          items: [],
          outliers: [],
        })),
      },
    ],
  };

  React.useEffect(() => {
    Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);
    const boxplot = new BoxPlotChart(canvasRef.current, {
      type: "boxplot",
      data: boxplotData,
      options: {
        indexAxis: axis,
        responsive: true,
      },
    });

    return () => boxplot.destroy();
  }, []);
  return (
    <div className="shadow rounded-md p-2">
      <canvas ref={canvasRef}></canvas>
      <p className="text-center mt-2">{axis === "y" ? "Values" : "Columns"}</p>
    </div>
  );
}

export default BoxPlot;
