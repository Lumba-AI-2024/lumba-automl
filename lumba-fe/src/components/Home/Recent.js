import { useRouter } from "next/router";
import React from "react";
import ArrowRight from "../Icon/ArrowRight";
import Grip from "../Icon/Grip";
import Dataset from "../Dataset";
import Model from "../Model";

export default function Recent({ title, data, workspaceName, workspacePage, type }) {
  const router = useRouter();
  return (
    <div className="w-full rounded-md shadow flex flex-col bg-white">
      <div className="px-4 py-3 flex justify-between">
        <div className="font-semibold">{title}</div>
        <Grip />
      </div>
      <div className="h-[1px] bg-gray/30 w-full"></div>
      <div className="min-h-[200px] py-2 grid place-items-center">
        {data?.length > 0 ? (
          <table className="my-4 w-[calc(100%-4rem)]">
            <thead>
              {workspacePage === "datasets" ? (
                <tr>
                  <th className="w-1/4 px-4">File Name</th>
                  <th className="w-1/4 px-4">Size</th>
                  <th className="w-1/4 px-0">Created on</th>
                  <th className="w-1/4 px-0">Modified on</th>
                </tr>
              ) : (
                <tr>
                  <th className="w-1/4 px-4">Dataset & Model Name</th>
                  <th className="w-1/4 px-4">Metric & Score</th>
                  <th className="w-1/4 px-4">Method & Algorithm</th>
                  <th className="w-1/4 px-4">Train Date</th>
                </tr>
              )}
              <tr className="border-b border-gray/50">
                <td colSpan="100%" className="pt-4"></td>
              </tr>
            </thead>
            <tbody>
              {workspacePage === "datasets"
                ? data?.map((dataset, index) => (
                  console.log(dataset.name),
                    <Dataset
                      key={dataset.file}
                      file={dataset.file}
                      name={dataset.name}
                      size={dataset.size}
                      createdOn={dataset.created_time}
                      modifiedOn={dataset.updated_time}
                      noActions
                      noShadow
                    />
                  ))
                : data?.map((model) => <Model key={model.id} {...model} noActions noShadow />)}
            </tbody>
          </table>
        ) : workspacePage === "datasets" ? (
          "No Datasets"
        ) : (
          "No Models"
        )}
      </div>
      <div className="h-[1px] bg-gray/30 w-full"></div>
      <button
        onClick={() => router.push(`/workspace/${workspaceName}/${workspacePage}?type=${type}`)}
        className="flex items-center justify-end px-4 py-3 hover:text-blue transition-all duration-300"
      >
        See all <ArrowRight />
      </button>
    </div>
  );
}
