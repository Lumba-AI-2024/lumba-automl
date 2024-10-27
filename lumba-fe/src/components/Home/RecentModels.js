import React from "react";
import Recent from "./Recent";

export default function RecentModels({ workspaceName, models, type }) {
  return (
    <Recent title="Recent Models" data={models} workspaceName={workspaceName} workspacePage="modeling" type={type}>
      No Dataset
    </Recent>
  );
}
