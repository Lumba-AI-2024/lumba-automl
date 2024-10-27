import Seo from "../../../../src/components/Seo";
import * as React from "react";
import DatasetPage from "../../../../src/components/Tutorial/Dataset/DatasetPage";
import { useRouter } from "next/router";
import DatasetPageTutorial1 from "../../../../src/components/Tutorial/Dataset/DatasetPageTutorial1";
import { IsStepContent, NotStepContent, StepProvider } from "../../../../src/components/Tutorial/Steps";
import DatasetPageTutorial2 from "../../../../src/components/Tutorial/Dataset/DatasetPageTutorial2";
import DatasetPageTutorial3 from "../../../../src/components/Tutorial/Dataset/DatasetPageTutorial3";
import DatasetPageTutorial4 from "../../../../src/components/Tutorial/Dataset/DatasetPageTutorial4";
import { useTutorial } from "../../../../src/hooks/useTutorial";

const Datasets = () => {
  const router = useRouter();
  const { workspaceName } = router.query;
  const shouldPlay = useTutorial();

  return (
    <>
      <Seo title={`${workspaceName} - Datasets`} />
      <StepProvider totalStep={4} shouldPlay={shouldPlay}>
        <NotStepContent>
          <DatasetPage />
        </NotStepContent>
        <IsStepContent>
          <DatasetPageTutorial1 />
          <DatasetPageTutorial2 />
          <DatasetPageTutorial3 />
          <DatasetPageTutorial4 />
          {/* <CreateWorkspaceButtonTutorial open={open} setOpen={setOpen} /> */}
        </IsStepContent>
      </StepProvider>
    </>
  );
};

export default Datasets;
