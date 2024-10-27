import { useRouter } from "next/router";
import Breadcrumb from "../../Breadcrumb";
import Seo from "../../Seo";
import Download from "../../Icon/Download";
import Pencil from "../../Icon/Pencil";
import Delete from "../../Icon/Delete";

import * as React from "react";
import { generateTime } from "../../../../src/helper/generateTime";
import Image from "next/image";
import { Step, StepContent, StepTitle, StepDescription, useStep } from "../Steps";

const details = {
  file: "Dara Lorem",
  size: 576.5,
  createdOn: "2023-05-07T07:55:08.171030Z",
  modifiedOn: "2023-05-06T18:37:12.171030Z",
};

const DatasetPageTutorial4 = () => {
  const router = useRouter();
  const { workspaceName } = router.query;

  const [isPreview, setIsPreview] = React.useState(true);

  const { step: currentStep } = useStep();

  if (currentStep !== 4) {
    return null;
  }

  return (
    <>
      <Seo title={`${workspaceName} - Datasets`} />
      <div className="h-full flex flex-col">
        <Breadcrumb
          links={[
            { label: workspaceName },
            { label: "Datasets", href: "/workspace/" + workspaceName + "/datasets" },
            { label: "Data Lorem", href: router.asPath },
          ]}
          active={"Data Lorem"}
        />

        <div className="mt-6">
          {/* Row 1 */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <img className="w-6 h-6" src="/assets/CSVIcon.svg" alt="csv" />
              <h1 className="text-2xl">{details.file}</h1>
            </div>
            <div className="flex gap-6">
              <Download />
              <Pencil />
              <Delete />
            </div>
          </div>

          {/* Row 2 */}
          <div className="mt-6">
            <h2>About Dataset</h2>
            <div className="grid grid-cols-3 mt-4">
              <div>
                <h3 className="mb-3">Size</h3>
                <p>{details.size} MB</p>
              </div>
              <div>
                <h3 className="mb-3">Date Created</h3>
                <p>{generateTime(details.created_time)}</p>
              </div>
              <div>
                <h3 className="mb-3">Date Modified</h3>
                <p>{generateTime(details.updated_time)}</p>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <ul className="mt-8 flex gap-8 relative px-2">
            <Step step={4}>
              <div className="relative">
                <button
                  className="font-bold h3"
                  onClick={() => {
                    setIsPreview(true);
                  }}
                >
                  Preview
                </button>
                <StepContent>
                  <StepTitle>Upload & View Dataset</StepTitle>
                  <StepDescription>
                    To view the content of your data, click on the list that you've just uploaded.
                  </StepDescription>
                </StepContent>
              </div>
            </Step>
            <button
              className="font-bold h3"
              onClick={() => {
                setIsPreview(false);
              }}
            >
              Column Info
            </button>
            <span className="absolute left-0 -bottom-2 h-[3px] w-full rounded-md bg-gray/30"></span>
            <div
              className={`absolute transition-all duration-300 -bottom-2 h-[3px] w-20 rounded-md bg-gradient-to-r from-lightblue to-blue ${
                isPreview ? "left-0" : "left-[96px] w-28"
              }`}
            ></div>
          </ul>

          {/* Row 4 */}
          <div className="w-full mt-6">
            <Image src="/assets/LumbaTableTutorial.svg" width={1180} height={535} className="w-full" alt="table" />
          </div>
        </div>
      </div>
    </>
  );
};

export default DatasetPageTutorial4;
