import { useRouter } from "next/router";
import React from "react";
import Button from "../Button/Button";
import EditDelete from "../EditDelete";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Bullseye from "../Icon/Bullseye";

// English.
TimeAgo.addLocale(en);

const ClockIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="currentColor"
      className="bi bi-clock"
      viewBox="0 0 16 16"
    >
      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
    </svg>
  );
};

const types = {
  predicting: "Predicting",
  forecasting: "Forecasting",
  object_segmentation: "Object Segmentation",
};

export default function WorkspaceCard({ username, workspaceName, description, lastUpdated, projectLink, type }) {
  const router = useRouter();

  // Create formatter (English).
  const timeAgo = new TimeAgo("en-US");

  const time = timeAgo.format(new Date(lastUpdated));

  return (
    <div>
      <div className="w-[16rem] rounded shadow">
        <div className="w-full h-full relative">
          <img src="/assets/LumbaCard.svg" alt="Lumba" />
          <EditDelete username={username} name={workspaceName} description={description} type={type} />
          <h2 className="absolute bottom-3 left-6 text-white w-[13rem] truncate">{workspaceName}</h2>
        </div>
        <div className="px-6 pt-6 pb-4">
          <p className="text-[11px] leading-4 text-justify text-black/60">{description}</p>
        </div>
        <div className="px-6 pt-4 pb-2 text-black/60">
          <div className=" flex items-center gap-3">
            <Bullseye />
            <span className="text-[11px]">{types[type]}</span>
          </div>
          <div className=" flex items-center gap-3">
            <ClockIcon />
            <span className="text-[11px]">Last updated {time}</span>
          </div>
        </div>
        <div className="pt-4 pb-6 flex justify-center">
          <Button onClick={() => router.push(projectLink)}>View Project</Button>
        </div>
      </div>
    </div>
  );
}
