import React from "react";
import Download from "./Icon/Download";
import Pencil from "./Icon/Pencil";
import Delete from "./Icon/Delete";
import FormModal from "./Form/FormModal";
import Input from "./Form/Input";
import { useRouter } from "next/router";
import FormModalContextProvider from "../context/FormModalContext";
import Spinner from "./Spinner";
import axios from "axios";
import { generateTime } from "../helper/generateTime";
import useDatasets from "../hooks/useDatasets";
import useCookie from "../hooks/useCookie";
import { useSearchParams } from "next/navigation";
import  useAutoML  from "../hooks/useAutoML";


export default function AutoML({
  automlname,
  dataset,
  datasetname,
  method,
  feature,
  target,
  createdOn,
  modifiedOn,
  isLoading = false,
  noActions = false,
  noShadow = false,
  workspaceName = "",
}) {
  const router = useRouter();
  const { asPath } = router;

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const username = useCookie("username");
  const { updateDataset, deleteDataset } = useDatasets(workspaceName, username, type);
  const { updateAutoML, deleteAutoML } = useAutoML(workspaceName, username);

  const [realPath, params] = asPath.split("?");
  const isHome = !realPath.split("/").includes("datasets");

  return (
    <>
      <tr>
        <td colSpan="100%" className={noActions ? "pt-2" : "pt-4"}></td>
      </tr>
      <tr
        className="relative cursor-pointer"
        onClick={() => router.push(realPath + "/newProject" + (isHome ? "/modelling/" : "/") + automlname)}
      >
        <td className="py-2 rounded-l-md w-56 px-4 h-14 relative z-10 bg-white">
          <div className={`flex gap-2 items-center ${isLoading && "text-gray/50"}`}>
            <img src="/assets/CSVIcon.svg" alt="csv" />
            {automlname}
          </div>
        </td>
        <td className="h-14 relative z-10 bg-white">{isLoading ? "Uploading..." : generateTime(createdOn)}</td>
        <td className="h-14 relative z-10 bg-white">{isLoading ? "-" : generateTime(modifiedOn)}</td>
        <td className="h-14 relative z-10 bg-white">{method}</td>
        <td className="h-14 relative z-10 bg-white">{target}</td>
        {!noActions && (
          <td className="py-2 rounded-r-md pr-8 h-14 relative bg-white w-[160px]">
            <div className="flex gap-6 items-center justify-between relative z-20">
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  <Download onClick={() => {}} />
                  <FormModalContextProvider>
                    <FormModal
                      variant="editAutoML"
                      formLabel="Edit AutoML"
                      CustomButton={Pencil}
                      submitLabel="Save Changes"
                      handleSubmit={(autoML) => {
                        updateAutoML(autoML, formData.filename, type);
                      }}
                    >
                      <Input label={"Name"} name={"filename"} placeholder="New dataset name" required />
                    </FormModal>
                  </FormModalContextProvider>
                  <FormModalContextProvider>
                    <FormModal
                      variant="deleteDataset"
                      formLabel="Delete Dataset"
                      buttonLabel="Delete"
                      buttonVariant="error"
                      CustomButton={Delete}
                      submitLabel="Delete"
                      handleSubmit={async () => {
                        const autoML = new FormData();
                        autoML.append("username", username);
                        autoML.append("automlname", automlname);
                        autoML.append("datasetname", datasetname);
                        autoML.append("workspace", workspaceName);

                        await deleteAutoML(autoML);
                      }}
                    >
                      <p>Are you sure you want to delete this dataset?</p>
                    </FormModal>
                  </FormModalContextProvider>
                </>
              )}
            </div>
          </td>
        )}
        {!noShadow && <td colSpan="100%" className="absolute inset-0 -z-1 w-full h-full shadow rounded-md"></td>}
      </tr>
    </>
  );
}
