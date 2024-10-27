import * as React from "react";

import { getAllDatasets } from "../../../../src/hooks/useDatasets";
import { parseCookie } from "../../../../src/helper/cookies";
import { getAllModels } from "../../../../src/hooks/useModels";
import { Toaster } from "react-hot-toast";
import { IsStepContent, NotStepContent, StepProvider } from "../../../../src/components/Tutorial/Steps";

import PredictingPage from "../../../../src/components/Tutorial/Predicting/PredictingPage";
import PredictingTutorial1 from "../../../../src/components/Tutorial/Predicting/PredictingTutorial1";
import PredictingTutorial2 from "../../../../src/components/Tutorial/Predicting/PredictingTutorial2";
import PredictingTutorial3 from "../../../../src/components/Tutorial/Predicting/PredictingTutorial3";
import PredictingTutorial4 from "../../../../src/components/Tutorial/Predicting/PredictingTutorial4";
import PredictingTutorial5 from "../../../../src/components/Tutorial/Predicting/PredictingTutorial5";
import PredictingTutorial6 from "../../../../src/components/Tutorial/Predicting/PredictingTutorial6";
import { useSearchParams } from "next/navigation";
import ForecastingPage from "../../../../src/components/Tutorial/Forecasting/ForecastingPage";
import ForecastingTutorial1 from "../../../../src/components/Tutorial/Forecasting/ForecastingTutorial1";
import ForecastingTutorial2 from "../../../../src/components/Tutorial/Forecasting/ForecastingTutorial2";
import ForecastingTutorial3 from "../../../../src/components/Tutorial/Forecasting/ForecastingTutorial3";
import ForecastingTutorial4 from "../../../../src/components/Tutorial/Forecasting/ForecastingTutorial4";
import ForecastingTutorial5 from "../../../../src/components/Tutorial/Forecasting/ForecastingTutorial5";
import { useTutorial } from "../../../../src/hooks/useTutorial";
import useDatasets from "../../../../src/hooks/useDatasets";
import { useRouter } from "next/router";
import useCookie from "../../../../src/hooks/useCookie";

const Modeling = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const shouldPlay = useTutorial();

  const router = useRouter();
  const { workspaceName } = router.query;

  const username = useCookie("username");

  const { datasets } = useDatasets(workspaceName, username, type);

  if (type === "forecasting") {
    return (
      <>
        <Toaster />
        <StepProvider totalStep={5} shouldPlay={shouldPlay} onFinish={() => {}}>
          <NotStepContent>
            <ForecastingPage datasets={datasets} />
          </NotStepContent>
          <IsStepContent>
            <ForecastingTutorial1 />
            <ForecastingTutorial2 />
            <ForecastingTutorial3 />
            <ForecastingTutorial4 />
            <ForecastingTutorial5 />
          </IsStepContent>
        </StepProvider>
      </>
    );
  }

  return (
    <>
      <Toaster />
      <StepProvider totalStep={6} shouldPlay={shouldPlay} onFinish={() => {}}>
        <NotStepContent>
          <PredictingPage datasets={datasets} />
        </NotStepContent>
        <IsStepContent>
          <PredictingTutorial1 />
          <PredictingTutorial2 />
          <PredictingTutorial3 />
          <PredictingTutorial4 />
          <PredictingTutorial5 />
          <PredictingTutorial6 />
        </IsStepContent>
      </StepProvider>
    </>
  );
};

export default Modeling;

// export async function getServerSideProps({ req, resolvedUrl }) {
//   const token = parseCookie(req.headers.cookie, "token");
//   const urlArray = resolvedUrl.split("/");
//   const workspace = urlArray[urlArray.length - 2];
//   const username = parseCookie(req.headers.cookie, "username");

//   const datasets = await getAllDatasets(
//     process.env.NEXT_PUBLIC_API_ROUTE + `/file/list/?workspace=${workspace}&username=${username}`,
//     token
//   );

//   const dataModels = await getAllModels({ token, workspace, username });

//   return { props: { datasets, dataModels } };
// }
