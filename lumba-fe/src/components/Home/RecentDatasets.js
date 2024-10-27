import React from "react";
import Recent from "./Recent";

export default function RecentDatasets({ workspaceName, datasets, type }) {
  return (
    <Recent title="Recent Datasets" data={datasets} workspaceName={workspaceName} workspacePage="datasets" type={type}>
      No Dataset
    </Recent>
  );
}
