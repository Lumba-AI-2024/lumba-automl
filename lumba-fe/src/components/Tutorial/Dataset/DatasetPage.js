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
export default function DatasetPage() {
  const router = useRouter();
  const { workspaceName } = router.query;

  let searchParams = useSearchParams();
  let type = searchParams.get("type");

  const username = useCookie("username");

  const { datasets, addDataset } = useDatasets(workspaceName, username, type);

  const [isUploading, setIsUploading] = React.useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center">
        <div className="flex-1">
          <Breadcrumb
            links={[{ label: workspaceName }, { label: "Datasets", href: router.asPath }]}
            active={"Datasets"}
          />
        </div>
        <FormModalContextProvider>
          <UploadFile
            buttonLabel={
              <div className="flex font-semibold items-center gap-1">
                <Plus />
                Upload
              </div>
            }
            formLabel="Upload File Datasets"
            handleSubmit={(formData) => {
              setIsUploading(true);
              const dataset = new FormData();
              if (type === "object_segmentation"){
                dataset.append("file", formData?.file);
              } else {
                dataset.append("file", formData?.file);
              }
              console.log(dataset.get('file0'));
              dataset.append("username", username);
              dataset.append("workspace", workspaceName);
              dataset.append("type", type);
              console.log(dataset.get('file'));
              console.log(formData?.file);
              addDataset(dataset).then(() => setIsUploading(false));
            }}
            workspaceType={type}
          />
        </FormModalContextProvider>
      </div>

      {type === "forecasting" && (
        <div className="flex justify-end mt-3">
          <p className="flex items-center gap-2">
            For forecasting, you can only upload weekly timestamped data <InfoWarning />
          </p>
        </div>
      )}

      {datasets.length > 0 || isUploading ? (
        <table className="mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th className="px-4">Size</th>
              <th>Created on</th>
              <th>Modified on</th>
              <th className="text-center">Actions</th>
            </tr>
            <tr className="border-b border-gray/50">
              <td colSpan="100%" className="pt-4"></td>
            </tr>
          </thead>
          <tbody>
            {isUploading && <Dataset file="Uploading..." createdOn="1" modifiedOn="1" isLoading={true} />}
            {datasets.map((dataset, index) => (
              console.log(dataset),
              console.log(dataset.file),
              <Dataset
                key={dataset.file}
                file={dataset.file}
                name={dataset.name}
                size={dataset.size}
                createdOn={dataset.created_time}
                modifiedOn={dataset.updated_time}
                workspaceName={workspaceName}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex-1 grid place-items-center">
          <div className="flex flex-col items-center justify-center">
            <img src="/assets/LumbaEmpty.svg" alt="No Datasets Found" className="w-[280px]" />
            <div className="flex flex-col gap-4 mt-8 items-center">
              <h1 className="font-medium">No Datasets Found</h1>
              <span>Upload your file to add datasets here</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
