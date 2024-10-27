import React from "react";
import BarChart from "./BarChart";

export default function Numeric({ column }) {
  const { column_name, total_data_valid, total_data_invalid, mean, median, mode, q1, q3, min, max, std, bar_chart } =
    column;

  const nonMissing = total_data_valid;
  const missing = total_data_invalid;

  const barChartLabels = Object.keys(bar_chart);
  const barChartValues = Object.values(bar_chart);

  const isFloat = barChartLabels[0].includes(".");
  const addZeroToMode = isFloat ? mode % 1 === 0 : false;
  const addZeroToMin = isFloat ? min % 1 === 0 : false;
  const addZeroToMax = isFloat ? max % 1 === 0 : false;

  const modeCount = bar_chart[addZeroToMode ? mode.toFixed(1) : mode];
  const modePercentage = Math.round((modeCount / (missing + nonMissing)) * 100);

  const minCount = bar_chart[addZeroToMin ? min.toFixed(1) : min];
  const minPercentage = Math.ceil((minCount / (missing + nonMissing)) * 100);

  const maxCount = bar_chart[addZeroToMax ? max.toFixed(1) : max];
  const maxPercentage = Math.ceil((maxCount / (missing + nonMissing)) * 100);

  const nonMissingPercentage = (nonMissing / (missing + nonMissing)) * 100;
  const missingPercentage = (missing / (missing + nonMissing)) * 100;

  return (
    <div className="bg-white rounded-lg pt-4 divide-y-[1.5px] divide-gray/30 shadow mt-4">
      {/* Header */}
      <div className="px-5 flex justify-between mb-4">
        <div className="space-x-3">
          <span className="font-medium text-sm">123</span>
          <span className="font-bold text-base">{column_name}</span>
        </div>
        <p className="text-base">Type: Numeric</p>
      </div>

      {/* Divider */}
      <div className="px-5 grid grid-cols-12 divide-x-[1.5px] divide-gray/30">
        {/* Left */}
        <div className="col-span-5 xl:col-span-4 pr-3 pt-4 pb-8 space-y-3">
          <div className="max-w-[452px] overflow-x-auto">
            <BarChart label={column_name} labels={barChartLabels} data={barChartValues} />
          </div>
        </div>

        {/* Right */}
        <div className="pl-5 pt-4 pb-8 col-span-7 xl:col-span-8 space-y-3">
          <div className="space-y-1">
            {/* Non-Missing & Missing Bar Ratio */}
            <div className="flex bg-gradient-to-r from-greencyan to-pinkpink rounded-sm">
              <div
                style={{ width: `calc(${nonMissingPercentage}%)` }}
                className="h-3 w-full bg-gradient-to-r from-greencyan to-seagull rounded-sm"
              ></div>
              <div
                style={{ width: `calc(${missingPercentage}%)` }}
                className="h-3 w-full bg-gradient-to-r from-redpink to-pinkpink rounded-r-sm"
              ></div>
            </div>

            {/* Non Missing */}
            <div className="grid gap-4 grid-cols-10">
              <div className="flex justify-between col-span-8">
                <div className="space-x-6 flex items-center">
                  <div className="w-3.5 h-3.5 bg-gradient-to-r from-greencyan to-seagull rounded-sm"></div>
                  <span className="text-sm">Non-Missing</span>
                </div>
                <span className="block text-sm">{nonMissing}</span>
              </div>
              <span className="block text-sm col-span-2 text-end">{nonMissingPercentage.toFixed(2) + "%"}</span>
            </div>

            {/* Missing */}
            <div className="grid gap-4 grid-cols-10">
              <div className="flex justify-between col-span-8">
                <div className="space-x-6 flex items-center">
                  <div className="w-3.5 h-3.5 bg-gradient-to-r from-redpink to-pinkpink rounded-sm"></div>
                  <span className="text-sm">Missing</span>
                </div>
                <span className="block text-sm">{missing}</span>
              </div>
              <span className="block text-sm col-span-2 text-end">{missingPercentage.toFixed(2) + "%"}</span>
            </div>

            {/* Others */}
            <div className="pt-3 -space-y-1">
              {/* Mean */}
              <div className="grid gap-4 grid-cols-10">
                <div className="flex justify-between col-span-8">
                  <span className="text-sm">Mean</span>
                  <span className="block text-sm">{mean.toFixed(2)}</span>
                </div>
              </div>

              {/* Median */}
              <div className="grid gap-4 grid-cols-10 pt-2">
                <div className="flex justify-between col-span-8">
                  <span className="text-sm">Median</span>
                  <span className="block text-sm">{median.toFixed(2)}</span>
                </div>
              </div>

              {/* Mode */}
              <div className="grid gap-4 grid-cols-10 pt-2">
                <div className="flex justify-between col-span-8">
                  <span className="text-sm">Mode</span>
                  <span className="block text-sm">{mode}</span>
                </div>
                <span className="block text-sm col-span-2 text-end">
                  {modePercentage + "%"} (total: {modeCount})
                </span>
              </div>

              {/* Quartile 1 */}
              <div className="grid gap-4 grid-cols-10 pt-2">
                <div className="flex justify-between col-span-8">
                  <span className="text-sm">Quartile 1</span>
                  <span className="block text-sm">{q1}</span>
                </div>
                <span className="block text-sm col-span-2 text-end"></span>
              </div>

              {/* Quartile 2 */}
              <div className="grid gap-4 grid-cols-10 pt-2">
                <div className="flex justify-between col-span-8">
                  <span className="text-sm">Quartile 2</span>
                  <span className="block text-sm">{median}</span>
                </div>
                <span className="block text-sm col-span-2 text-end"></span>
              </div>

              {/* Quartile 3 */}
              <div className="grid gap-4 grid-cols-10 pt-2">
                <div className="flex justify-between col-span-8">
                  <span className="text-sm">Quartile 3</span>
                  <span className="block text-sm">{q3}</span>
                </div>
                <span className="block text-sm col-span-2 text-end"></span>
              </div>

              {/* Min */}
              <div className="grid gap-4 grid-cols-10 pt-2">
                <div className="flex justify-between col-span-8">
                  <span className="text-sm">Min</span>
                  <span className="block text-sm">{min}</span>
                </div>
                <span className="block text-sm col-span-2 text-end">
                  {minPercentage + "%"} (total: {minCount})
                </span>
              </div>

              {/* Max */}
              <div className="grid gap-4 grid-cols-10 pt-2">
                <div className="flex justify-between col-span-8">
                  <span className="text-sm">Max</span>
                  <span className="block text-sm">{max}</span>
                </div>
                <span className="block text-sm col-span-2 text-end">
                  {maxPercentage + "%"} (total: {maxCount})
                </span>
              </div>

              {/* Std */}
              <div className="grid gap-4 grid-cols-10 pt-2">
                <div className="flex justify-between col-span-8">
                  <span className="text-sm">Standard Deviation</span>
                  <span className="block text-sm">{std.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
