import React from "react";
import { useRouter } from "next/router";
import Breadcrumb from "../../Breadcrumb";
import FormModalContextProvider from "../../../context/FormModalContext";
import Plus from "../../Icon/Plus";
import UploadFile from "../../Form/UploadFile";
import Dataset from "../../Dataset";
import useDatasets from "../../../hooks/useDatasets";
import useCookie from "../../../hooks/useCookie";
import { useSearchParams } from "next/navigation";
import InfoWarning from "../../Icon/InfoWarning";
import Button from "../../Button/Button";
import AutoML from "../../AutoML";
import useAutoML from "../../../hooks/useAutoML";

export default function AutoMLPage() {
  const router = useRouter();
  const { workspaceName } = router.query;

  let searchParams = useSearchParams();
  let type = searchParams.get("type");

  const username = useCookie("username");

  const { autoMLs, addAutoML } = useAutoML(workspaceName, username, type);

  const [isUploading, setIsUploading] = React.useState(false);
  // route to new-project.js

  const handleNewProject = () => {

    router.push(`/workspace/${workspaceName}/automl/newProject/upload?type=${type}`);
  };


  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center">
        <Button
          onClick={handleNewProject}
          className="flex items-center gap-1"
          handleSubmit={(formData) => {
            setIsUploading(true);
            const autoML = new FormData();

            autoML.append("name", formData?.file);

            console.log(dataset.get('file0'));
            autoML.append("username", username);
            autoML.append("workspace", workspaceName);
            autoML.append("type", type);
            console.log(dataset.get('file'));
            console.log(formData?.file);
            addDataset(dataset).then(() => setIsUploading(false));
          }}

        >
          <div className="flex font-semibold items-center gap-1">
            <Plus />
            Add Automated ML Job
          </div>
        </Button>
      </div>

      {autoMLs.length > 0 || isUploading ? (
        <table className="mt-4">
          <thead>
            <tr>
              <th>AutoML Name</th>
              <th>Created on</th>
              <th>Modified on</th>
              <th>Method</th>
              <th>Target</th>
              <th>Actions</th>
            </tr>
            <tr className="border-b border-gray/50">
              <td colSpan="100%" className="pt-4"></td>
            </tr>
          </thead>
          <tbody>
            {isUploading && <Dataset file="Uploading..." createdOn="1" modifiedOn="1" isLoading={true} />}
            {autoMLs.map((autoML, index) => (
              <AutoML
                key={autoML.name}
                automlname={autoML.name}
                datasetname={autoML.dataset}
                method={autoML.method}
                feature={autoML.feature}
                target={autoML.target}
                createdOn={autoML.created_time}
                modifiedOn={autoML.updated_time}
                workspaceName={workspaceName}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex-1 grid place-items-center">
          <div className="flex flex-col items-center justify-center">
            <img src="/assets/LumbaEmpty.svg" alt="No AutoML Project Found" className="w-[280px]" />
            <div className="flex flex-col gap-4 mt-8 items-center">
              <h1 className="font-medium">No Projects Found</h1>
              <span>Upload your file to add projects here</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
