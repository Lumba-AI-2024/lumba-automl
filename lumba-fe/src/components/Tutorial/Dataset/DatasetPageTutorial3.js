import React from "react";
import { useRouter } from "next/router";
import Breadcrumb from "../../Breadcrumb";
import Plus from "../../Icon/Plus";
import { Step, StepContent, StepTitle, StepDescription } from "../Steps";
import { useSearchParams } from "next/navigation";
import InfoWarning from "../../Icon/InfoWarning";
import Button from "../../Button/Button";
import Dataset from "../../Dataset";
import { useStep } from "../Steps";

export default function DatasetPageTutorial3() {
  const router = useRouter();
  const { workspaceName } = router.query;

  let searchParams = useSearchParams();
  let type = searchParams.get("type");

  const { step: currentStep } = useStep();

  if (currentStep !== 3) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center">
        <div className="flex-1">
          <Breadcrumb
            links={[{ label: workspaceName }, { label: "Datasets", href: router.asPath }]}
            active={"Datasets"}
          />
        </div>
        <Button>
          <div className="flex font-semibold items-center gap-1">
            <Plus />
            Upload
          </div>
        </Button>
      </div>

      {type === "forecasting" && (
        <div className="flex justify-end mt-3">
          <p className="flex items-center gap-2">
            For forecasting, you can only upload weekly timestamped data <InfoWarning />
          </p>
        </div>
      )}

      <table className="mt-4">
        <thead>
          <tr>
            <th>File Name</th>
            <th className="px-4">Size</th>
            <th>Created on</th>
            <th>Modified on</th>
            <th>Actions</th>
          </tr>
          <tr className="border-b border-gray/50">
            <td colSpan="100%" className="pt-4"></td>
          </tr>
        </thead>
        <tbody>
          <Dataset
            file="Dara Lorem"
            size={576.5}
            createdOn="2023-05-07T07:55:08.171030Z"
            modifiedOn="2023-05-06T18:37:12.171030Z"
            workspaceName={workspaceName}
          />
        </tbody>
      </table>
      <Step step={3}>
        <div className="relative">
          <StepContent position="center">
            <StepTitle>Upload & View Dataset</StepTitle>
            <StepDescription>
              To view the content of your data, click on the list that you've just uploaded.
            </StepDescription>
          </StepContent>
        </div>
      </Step>
    </div>
  );
}
