import React from "react";
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
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function getGradientPurple(ctx, chartArea) {
	let width, height, gradient;
	const chartWidth = chartArea.right - chartArea.left;
	const chartHeight = chartArea.bottom - chartArea.top;
	if (!gradient || width !== chartWidth || height !== chartHeight) {
		// Create the gradient because this is either the first render
		// or the size of the chart has changed
		width = chartWidth;
		height = chartHeight;
		gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

		gradient.addColorStop(0, "rgb(103, 126, 233)");
		gradient.addColorStop(1, "rgb(118, 75, 162)");
	}

	return gradient;
}

function getGradientPink(ctx, chartArea) {
	let width, height, gradient;
	const chartWidth = chartArea.right - chartArea.left;
	const chartHeight = chartArea.bottom - chartArea.top;
	if (!gradient || width !== chartWidth || height !== chartHeight) {
		// Create the gradient because this is either the first render
		// or the size of the chart has changed
		width = chartWidth;
		height = chartHeight;
		gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

		gradient.addColorStop(0, "rgb(255, 117, 140)");
		gradient.addColorStop(1, "rgb(255, 126, 179)");
	}

	return gradient;
}

function getGradientLightPink(ctx, chartArea) {
	let width, height, gradient;
	const chartWidth = chartArea.right - chartArea.left;
	const chartHeight = chartArea.bottom - chartArea.top;
	if (!gradient || width !== chartWidth || height !== chartHeight) {
		// Create the gradient because this is either the first render
		// or the size of the chart has changed
		width = chartWidth;
		height = chartHeight;
		gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);

		gradient.addColorStop(0, "#FFD8E8");
		gradient.addColorStop(1, "#FFD8E8");
	}

	return gradient;
}

function getColorPurple(context) {
	const chart = context.chart;
	const { ctx, chartArea } = chart;

	if (!chartArea) {
		// This case happens on initial chart load
		return;
	}
	return getGradientPurple(ctx, chartArea);
}

function getColorPink(context) {
	const chart = context.chart;
	const { ctx, chartArea } = chart;

	if (!chartArea) {
		// This case happens on initial chart load
		return;
	}
	return getGradientPink(ctx, chartArea);
}

function getColorLightPink(context) {
	const chart = context.chart;
	const { ctx, chartArea } = chart;

	if (!chartArea) {
		// This case happens on initial chart load
		return;
	}
	return getGradientLightPink(ctx, chartArea);
}

const options = {
	responsive: true,
	aspectRatio: 3.5,
	maintainAspectRatio: true,
	plugins: {
		legend: {
			// position: "bottom",
			// labels: {
			//   boxHeight: 2,
			// },
			display: false,
		},
		tooltip: {
			callbacks: {
				title: (context) => {
					return `Week ${context[0].label}`;
				},
			},
		},
	},
};

const getLabels = (data, key) => {
	return Object.values(data[key]);
};

const getActualData = (data, key, threshold) => {
	let actualData = Object.values(data[key]);
	return actualData.slice(0, actualData.length - threshold);
};

const getForecastedData = (data, key, threshold) => {
	let forecastedData = Object.values(data[key]);
	return forecastedData.slice(forecastedData.length - threshold, forecastedData.length);
};

const getThreshold = (jsonData) => {
	return jsonData?.upper_bound?.length;
};

export default function LineChart({ jsonData, threshold }) {
	const labelY = Object.keys(jsonData.data)[1];
	const labelX = Object.keys(jsonData.data)[0];
	// const threshold = getThreshold(jsonData);

	const labels = getLabels(jsonData.data, labelX);
	const actualData = getActualData(jsonData.data, labelY, threshold);
	const forecastedData = getForecastedData(jsonData.data, labelY, threshold);

	const lowerBound = jsonData["lower_bound"]["lower_bound_qty"];
	const lowerBoundLength = lowerBound.length;
	const upperBound = jsonData["upper_bound"]["upper_bound_qty"];
	const upperBoundLength = upperBound.length;

	const data = {
		labels,
		datasets: [
			{
				label: "Actual Data",
				data: actualData,
				borderColor: getColorPurple,
				backgroundColor: getColorPurple,
			},
			{
				label: "Forecasted Data",
				data: [
					...Array.from(actualData).map((data, i) => {
						if (i !== actualData.length - 1) {
							return null;
						}

						return data;
					}),
					...forecastedData,
				],
				borderColor: getColorPink,
				backgroundColor: getColorPink,
			},
			{
				label: "Lower Bound",
				data: [
					...Array.from(actualData).map((data, i) => {
						if (i !== actualData.length - 1) {
							return null;
						}

						return data;
					}),
					...lowerBound.slice(lowerBoundLength - threshold, lowerBoundLength),
				],
				borderColor: getColorLightPink,
				backgroundColor: getColorLightPink,
			},
			{
				label: "Upper Bound",
				data: [
					...Array.from(actualData).map((data, i) => {
						if (i !== actualData.length - 1) {
							return null;
						}

						return data;
					}),
					...upperBound.slice(upperBoundLength - threshold, upperBoundLength),
				],
				borderColor: getColorLightPink,
				backgroundColor: getColorLightPink,
			},
		],
	};

	return (
		<>
			<div className="relative pl-8 pb-8">
				<span className="absolute left-0 inset-y-0 flex items-center rotate-[270deg] ">{labelY ?? "Label Y"}</span>
				<span className="absolute bottom-0 inset-x-0 flex justify-center">{labelX ?? "Label X"}</span>
				<Line options={options} data={data} />
			</div>
			<div className="flex justify-center mt-4 gap-16">
				<div className="flex items-center gap-1">
					<div className="w-10 h-1.5 bg-gradient-to-r from-[#677ee9] to-[#764ba2]"></div>
					<span>Actual Data</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-10 h-1.5 bg-gradient-to-r from-[#ff758c] to-[#ff7eb3]"></div>
					<span>Forecasted Data</span>
				</div>
				<div className="flex items-center gap-1">
					<div className="w-10 h-1.5 bg-gradient-to-r from-[#FFD8E8] to-[#FFD8E8]"></div>
					<span>Lower Bound (LB) & Upper Bound (UB)</span>
				</div>
			</div>
		</>
	);
}
