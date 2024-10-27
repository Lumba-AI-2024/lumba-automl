import React, { useState } from "react";
import { useRouter } from "next/router";
import Breadcrumb from "../../Breadcrumb";
import FormModalContextProvider from "../../../context/FormModalContext";
import Plus from "../../Icon/Plus";
import { useSearchParams } from "next/navigation";
import InfoWarning from "../../Icon/InfoWarning";
import UploadFileModalTutorial from "./UploadFileModalTutorial";
import { useStep } from "../Steps";

export default function DatasetPageTutorial2() {
  const router = useRouter();
  const { workspaceName } = router.query;

  const [open, setOpen] = useState(false);

  let searchParams = useSearchParams();
  let type = searchParams.get("type");

  const { step: currentStep } = useStep();

  if (currentStep !== 2) {
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
          <UploadFileModalTutorial
            open={open}
            setOpen={setOpen}
            buttonLabel={
              <div className="flex font-semibold items-center gap-1">
                <Plus />
                Upload
              </div>
            }
            formLabel="Upload File Datasets"
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
    </div>
  );
}
