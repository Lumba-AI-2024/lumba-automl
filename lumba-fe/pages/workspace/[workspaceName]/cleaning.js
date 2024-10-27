import * as React from "react";

import CleaningPage from "../../../src/components/Tutorial/Cleaning/CleaningPage";
import { IsStepContent, NotStepContent, StepProvider } from "../../../src/components/Tutorial/Steps";
import CleaningTutorial1 from "../../../src/components/Tutorial/Cleaning/CleaningTutorial1";
import CleaningTutorial2 from "../../../src/components/Tutorial/Cleaning/CleaningTutorial2";
import CleaningTutorial3 from "../../../src/components/Tutorial/Cleaning/CleaningTutorial3";
import CleaningTutorial4 from "../../../src/components/Tutorial/Cleaning/CleaningTutorial4";
import { useTutorial } from "../../../src/hooks/useTutorial";

const Cleaning = () => {
  const shouldPlay = useTutorial();
  return (
    <>
      <StepProvider
        totalStep={4}
        shouldPlay={shouldPlay}
        onFinish={() => {
          try {
            const el = document.getElementById("layout");
            el.scrollTo({ top: 0, behavior: "smooth" });
          } catch (err) {}
        }}
      >
        <NotStepContent>
          <CleaningPage />
        </NotStepContent>
        <IsStepContent>
          <CleaningTutorial1 />
          <CleaningTutorial2 />
          <CleaningTutorial3 />
          <CleaningTutorial4 />
        </IsStepContent>
      </StepProvider>
    </>
  );
};

export default Cleaning;
