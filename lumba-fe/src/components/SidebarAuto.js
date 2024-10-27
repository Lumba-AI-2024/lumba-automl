import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import FormModalContextProvider from "../context/FormModalContext";
import Form from "./Form";
import Select from "./Select/Select";
import { WORKSPACE, getAllWorkspace } from "../hooks/useWorkspaces";
import useSWR from "swr";
import useCookie from "../hooks/useCookie";


const steps = [
  { label: "Select Dataset", href: "upload" },
  { label: "Preprocessing Check", href: "preprocess" },
];


export default function SidebarAuto() {
  const router = useRouter();
  const { workspaceName } = router.query;

  // Get the current pathname from the router
  const currentPathname = router.pathname;



  return (
    <div className="mr-7 relative py-4 pl-8 h-[calc(200vh-55px)] bg-white shadow pr-4">
      <ul className="flex flex-col gap-8 py-4">
        {steps.map((step, index) => (
          
        <li
          key={index}
          className={`flex items-center font-medium transition duration-300 ${currentPathname.startsWith(`/workspace/[workspaceName]/automl/newProject/${step.href}`) ? 'text-green-500' : 'hover:text-gray-500'}`}
        >
          
          {console.log(currentPathname)}
          {console.log(workspaceName)}
          {console.log(step.href)}
          {console.log(`/workspace/${workspaceName}/automl/newProject${step.href}`)}
          {console.log(currentPathname === `/workspace/[workspaceName]/automl/newProject${step.href}`)}
          {index + 1}. {step.label}
        </li>
        ))}
      </ul>
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-20">
        <img src="/assets/LumbaSidebar.svg" alt="Lumba" />
      </div>
    </div>
  );
}
