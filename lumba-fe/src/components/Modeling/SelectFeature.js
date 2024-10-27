import React from "react";
import MultiSelect from "../Select/MultiSelect";
import Select from "../Select/Select";
import Question from "../Icon/Question";

const labels = {
  LINEAR: "This method only uses numerical column as a predictor variable",
  KMEANS: "This method only uses numerical column as a predictor variable",
  RANDOM_FOREST: "You can choose more than one numerical columns as predictor variables",
  DECISION_TREE: "You can choose more than one numerical columns as predictor variables",
};

export default function SelectFeature({ algorithmSelected, username, workspace }) {
  return (
    <>
      <div className="flex items-center gap-2">
        Feature to be trained <Question label={labels[algorithmSelected]} />
      </div>

      {["DECISION_TREE", "RANDOM_FOREST", "KMEANS"].includes(algorithmSelected) ? (
        <MultiSelect
          variant="withBorder"
          instanceId="select-multiple"
          placeholder={"Select one or more values..."}
          name="feature"
          onChange={(formData, setOptions, setFormData) => {
            const { dataset, method } = formData;

            if (!dataset || !method) return null;
            setFormData((previous) => ({
              ...previous,
              feature: null,
            }));

            const fetchDataset = async () => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_ROUTE}/modeling/columns/?datasetname=${dataset}&username=${username}&workspace=${workspace}&method=REGRESSION`
              );
              const { columns } = await res.json();
              const keys = columns;
              if (keys[0] === "Unnamed: 0") {
                keys.shift();
              }
              const options = keys.map((key) => ({
                value: key,
                label: key,
              }));
              setOptions(options);
            };
            fetchDataset();
          }}
        />
      ) : (
        <Select
          placeholder="Select column"
          name="feature"
          onChange={(formData, setOptions, setFormData) => {
            const { dataset, method } = formData;

            if (!dataset || !method) return null;
            setFormData((previous) => ({
              ...previous,
              feature: null,
            }));

            const fetchDataset = async () => {
              const res = await fetch(
                `${
                  process.env.NEXT_PUBLIC_API_ROUTE
                }/modeling/columns/?datasetname=${dataset}&username=${username}&workspace=${workspace}&method=${method.toUpperCase()}`
              );
              const { columns } = await res.json();
              const keys = columns;
              if (keys[0] === "Unnamed: 0") {
                keys.shift();
              }
              const options = keys.map((key) => ({
                value: key,
                label: key,
              }));
              setOptions(options);
            };
            fetchDataset();
          }}
        />
      )}
    </>
  );
}
