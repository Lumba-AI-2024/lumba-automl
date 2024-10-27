import React from "react";
import Select from "../Select/Select";

export default function ForecastFor() {
  return (
    <>
      <div className="flex items-center gap-2">Forecast For</div>

      <Select
        placeholder="Select week(s)"
        name="week"
        items={[
          {
            value: 1,
            label: "1 week",
          },
          {
            value: 2,
            label: "2 weeks",
          },
          {
            value: 3,
            label: "3 weeks",
          },
          {
            value: 4,
            label: "4 weeks",
          },
          {
            value: 5,
            label: "5 weeks",
          },
          {
            value: 6,
            label: "6 weeks",
          },
          {
            value: 7,
            label: "7 weeks",
          },
          {
            value: 8,
            label: "8 weeks",
          },
          {
            value: 9,
            label: "9 weeks",
          },
          {
            value: 10,
            label: "10 weeks",
          },
        ]}
      />
    </>
  );
}
