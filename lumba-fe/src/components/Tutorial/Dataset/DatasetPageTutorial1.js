import React from "react";
import { useRouter } from "next/router";
import Breadcrumb from "../../Breadcrumb";
import FormModalContextProvider from "../../../context/FormModalContext";
import Plus from "../../Icon/Plus";
import UploadFile from "../../Form/UploadFile";
import { Step, StepContent, StepTitle, StepDescription, useStep } from "../Steps";
import Button from "../../Button/Button";
import { useSearchParams } from "next/navigation";
import InfoWarning from "../../Icon/InfoWarning";

function CustomButton({ onClick }) {
  return (
    <Step step={1}>
      <div className="relative">
        <Button onClick={onClick}>
          <div className="flex font-semibold items-center gap-1">
            <Plus />
            Upload
          </div>
        </Button>
        <StepContent position="right">
          <StepTitle>Upload & View Dataset</StepTitle>
          <StepDescription>Click this button to upload your file to Lumba.</StepDescription>
        </StepContent>
      </div>
    </Step>
  );
}

export default function DatasetPageTutorial1() {
  const router = useRouter();
  const { workspaceName } = router.query;

  let searchParams = useSearchParams();
  let type = searchParams.get("type");

  const { step: currentStep } = useStep();

  if (currentStep !== 1) {
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
        <FormModalContextProvider>
          <UploadFile CustomButton={CustomButton} formLabel="Upload File Datasets" handleSubmit={() => {}} />
        </FormModalContextProvider>
      </div>

      {type === "forecasting" && (
        <div className="flex justify-end mt-3">
          <p className="flex items-center gap-2">
            For forecasting, you can only upload weekly timestamped data <InfoWarning />
          </p>
        </div>
      )}

      <div className="flex-1 grid place-items-center">
        <div className="flex flex-col items-center justify-center">
          <img src="/assets/LumbaEmpty.svg" alt="No Datasets Found" className="w-[280px]" />
          <div className="flex flex-col gap-4 mt-8 items-center">
            <h1 className="font-medium">No Datasets Found</h1>
            <span>Upload your file to add datasets here</span>
          </div>
        </div>
      </div>
    </div>
  );
}
