import React from "react";

export default function Categoric({ column }) {
  const { column_name, total_data_valid, total_data_invalid, unique, mode, unique_values } = column;

  const uniqueValueKeys = Object.keys(unique_values) || [];
  const uniqueValueVals = Object.values(unique_values) || [];

  const nonMissing = total_data_valid;
  const missing = total_data_invalid;

  const modePercentage = unique_values[mode];
  const modeCount = Math.round((modePercentage * nonMissing) / 100);

  const nonMissingPercentage = (nonMissing / (missing + nonMissing)) * 100;
  const missingPercentage = (missing / (missing + nonMissing)) * 100;
  return (
    <div className="bg-white rounded-lg pt-4 divide-y-[1.5px] divide-gray/30 shadow mt-4">
      {/* Header */}
      <div className="px-5 flex justify-between mb-4">
        <div className="space-x-3">
          <span className="font-medium text-sm">Aa</span>
          <span className="font-bold text-base">{column_name}</span>
        </div>
        <p className="text-base">Type: Categoric</p>
      </div>

      {/* Divider */}
      <div className="px-5 grid grid-cols-12 divide-x-[1.5px] divide-gray/30">
        {/* Left */}
        <div className="col-span-5 xl:col-span-4 pr-3 pt-4 pb-8 space-y-3 ">
          <div className="flex justify-between">
            <p className="font-bold text-lg">Unique values</p>
            <span className="font-bold text-lg">{unique}</span>
          </div>

          {uniqueValueKeys.map((uniqueValue, i) => {
            return (
              <div key={uniqueValue} className="flex justify-between">
                <p className="text-sm">{uniqueValue}</p>
                <span className="text-sm">{uniqueValueVals[i] + "%"}</span>
              </div>
            );
          })}
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
              {/* Unique */}
              <div className="grid gap-4 grid-cols-10 pt-2">
                <div className="flex justify-between col-span-8">
                  <span className="text-sm">Unique</span>
                  <span className="block text-sm">{unique}</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
