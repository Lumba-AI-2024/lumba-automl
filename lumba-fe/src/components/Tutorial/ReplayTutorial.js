import * as React from "react";
import { useRouter } from "next/router";
import { cn } from "../../helper/utils";
import useSWR from "swr";
import axios from "axios";
import { getCookie } from "../../helper/cookies";
import useCookie from "../../hooks/useCookie";

const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE;

const WORKSPACE = API_ROUTE + "/workspace/list/";

export default function ReplayTutorial({ isOpen }) {
  const router = useRouter();

  const [isClient, setIsClient] = React.useState(false);
  const username = useCookie("username");

  const { data: workspace } = useSWR(isClient ? `${WORKSPACE}?username=${username}` : null, async (url) => {
    const { data } = await axios(url, {
      headers: {
        Authorization: `Token ${getCookie("token")}`,
      },
    });

    return data;
  });

  const predictingWorkspace = workspace?.filter((ws) => ws.type === "predicting")[0];
  const forecastingWorkspace = workspace?.filter((ws) => ws.type === "forecasting")[0];

  const disabled = {
    createWorkspace: false,
    updateDataset: !workspace,
    cleanDataset: !workspace,
    predicting: !predictingWorkspace,
    forecasting: !forecastingWorkspace,
  };

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } z-40 absolute right-1/2 translate-x-1/2 top-full mt-2 shadow flex flex-col py-1 bg-white rounded-md`}
    >
      <button
        onClick={() => router.push("/?play=true")}
        disabled={disabled.createWorkspace}
        aria-disabled={disabled.createWorkspace}
        className={cn(
          "hover:text-white hover:bg-blue text-black/60 px-3 py-1 text-[11px] text-left whitespace-nowrap",
          "aria-disabled:hover:bg-transparent aria-disabled:hover:text-black/60 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed"
        )}
      >
        Tutorial Create Workspace
      </button>
      <button
        onClick={() => router.push(`/workspace/${predictingWorkspace.name}/datasets?type=predicting&play=true`)}
        disabled={disabled.updateDataset}
        aria-disabled={disabled.updateDataset}
        className={cn(
          "hover:text-white hover:bg-blue text-black/60 px-3 py-1 text-[11px] text-left whitespace-nowrap",
          "aria-disabled:hover:bg-transparent aria-disabled:hover:text-black/60 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed"
        )}
      >
        Tutorial Update Dataset
      </button>
      <button
        onClick={() => router.push(`/workspace/${predictingWorkspace.name}/cleaning?type=predicting&play=true`)}
        disabled={disabled.cleanDataset}
        aria-disabled={disabled.cleanDataset}
        className={cn(
          "hover:text-white hover:bg-blue text-black/60 px-3 py-1 text-[11px] text-left whitespace-nowrap",
          "aria-disabled:hover:bg-transparent aria-disabled:hover:text-black/60 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed"
        )}
      >
        Tutorial Clean Dataset
      </button>
      <button
        onClick={() => router.push(`/workspace/${predictingWorkspace.name}/modeling?type=predicting&play=true`)}
        disabled={disabled.predicting}
        aria-disabled={disabled.predicting}
        className={cn(
          "hover:text-white hover:bg-blue text-black/60 px-3 py-1 text-[11px] text-left whitespace-nowrap",
          "aria-disabled:hover:bg-transparent aria-disabled:hover:text-black/60 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed"
        )}
      >
        Tutorial Create Predicting Model
      </button>
      <button
        onClick={() => router.push(`/workspace/${forecastingWorkspace.name}/modeling?type=forecasting&play=true`)}
        disabled={disabled.forecasting}
        aria-disabled={disabled.forecasting}
        className={cn(
          "hover:text-white hover:bg-blue text-black/60 px-3 py-1 text-[11px] text-left whitespace-nowrap",
          "aria-disabled:hover:bg-transparent aria-disabled:hover:text-black/60 aria-disabled:opacity-70 aria-disabled:cursor-not-allowed"
        )}
      >
        Tutorial Create Forecasting Model
      </button>
    </div>
  );
}
