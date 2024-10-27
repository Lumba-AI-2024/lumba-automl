import React from "react";
import { useSearchParams } from "next/navigation";
import Model from "../../../../src/components/Model";
import Input from "../../../../src/components/Form/Input";
import { useRouter } from "next/router";
import Seo from "../../../../src/components/Seo";
import Breadcrumb from "../../../../src/components/Breadcrumb";
import FormModalContextProvider from "../../../../src/context/FormModalContext";
import ModelingModalTutorial from "../Predicting/ModelingModalTutorial";
import Plus from "../../../../src/components/Icon/Plus";
import Select from "../../../../src/components/Select/Select";
import useCookie from "../../../../src/hooks/useCookie";
import { Step, StepContent, StepTitle, StepDescription, useStep } from "../Steps";
import ForecastFor from "../../Modeling/ForecastFor";
import TargetForecastTutorial from "./TargetForecastTutorial";

const algorithms = {
  REGRESSION: [
    { value: "LINEAR", label: "Linear Regression" },
    { value: "RANDOM_FOREST", label: "Random Forest" },
    // { value: "LOGISTIC", label: "Logistic Regression" },
    // { value: "POLYNOMIAL", label: "Polynomial Regression" },
  ],
  CLASSIFICATION: [{ value: "DECISION_TREE", label: "Decision Tree" }],
  CLUSTERING: [{ value: "KMEANS", label: "K-Means" }],
  FORECASTING: [
    {
      value: "ARIMA",
      label: "ARIMA",
    },
    {
      value: "LSTM",
      label: "LSTM",
    },
    {
      value: "XGBOOST",
      label: "XGBoost",
    },
  ],
};

export default function ForecastingTutorial5({ datasets }) {
  const router = useRouter();
  const { workspaceName } = router.query;

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const username = useCookie("username");

  const [step, setStep] = React.useState(1);

  const [method, setMethod] = React.useState("");
  const [algorithmSelected, setAlgorithmSelected] = React.useState("");

  const algorithm = algorithms[method] || [];
  const algorithmValue = algorithm[0] && algorithm[0]["value"];

  const step2RequiredFields = ["REGRESSION", "CLASSIFICATION"].includes(method)
    ? ["feature", "target"]
    : ["feature", "kValue"];

  const { step: currentStep } = useStep();

  if (currentStep !== 5) {
    return null;
  }

  return (
    <>
      <Seo title={`${workspaceName} - Modeling`} />

      <div className="h-full flex flex-col">
        <div className="flex items-center">
          <div className="flex-1">
            <Breadcrumb
              links={[{ label: workspaceName }, { label: "Modeling", href: router.asPath }]}
              active={"Modeling"}
            />
          </div>
          <FormModalContextProvider>
            <ModelingModalTutorial
              step={step}
              setStep={() => {}}
              formLabel="Create Model"
              step2RequiredFields={step2RequiredFields}
              buttonLabel={
                <div className="flex font-semibold items-center gap-1">
                  <Plus />
                  Create
                </div>
              }
              submitLabel="Create"
              handleSubmit={(formData, setFormData) => {}}
            >
              <div className={`${step === 1 ? "flex flex-col gap-2" : "hidden"}`}>
                <Input label="Model Name" placeholder="Model name" name="modelName" required />

                <p>Dataset</p>
                <Select
                  placeholder="Select dataset"
                  name="dataset"
                  items={datasets?.map((dataset) => ({ value: dataset.file, label: dataset.file })) || []}
                />

                <Input label="Method" inputValue="Forecasting" name="method" readOnly />

                <p>Algorithm</p>
                <Select
                  placeholder="Select algorithm"
                  name="algorithm"
                  items={algorithms.FORECASTING}
                  onChange={(formData, setFormData) => {
                    setAlgorithmSelected(formData.algorithm);
                  }}
                />
              </div>
              <div className={`${step === 2 ? "flex flex-col gap-2" : "hidden"}`}>
                <ForecastFor />
                <Step step={4}>
                  <div className="relative">
                    <TargetForecastTutorial username={username} workspace={workspaceName} />

                    <StepContent position="center">
                      <StepTitle>Create Forecasting Model</StepTitle>
                      <StepDescription>
                        Enter your input for how many weeks you want to forecast
                        <br />
                        and select a numerical column for the target.
                      </StepDescription>
                    </StepContent>
                  </div>
                </Step>
                {algorithmSelected === "LSTM" && (
                  <>
                    <NSteps />
                    <Input label="Units" placeholder="Enter value of units" name="units" required={false} />
                  </>
                )}
              </div>
            </ModelingModalTutorial>
          </FormModalContextProvider>
        </div>

        <table className="mt-4 relative z-0">
          <thead>
            <tr>
              <th className="px-4">Dataset & Model Name</th>
              <th className="px-4">Metric & Score</th>
              <th className="px-4">Method & Algorithm</th>
              <th className="px-4">Train Date</th>
              <th className="px-4">Actions</th>
            </tr>
            <tr className="border-b border-gray/50">
              <td colSpan="100%" className="pt-4"></td>
            </tr>
          </thead>
          <tbody>
            <Model
              username={"Tutorial"}
              workspace={"Tutorial"}
              {...{
                modelName: "Forecasting Sales",
                file: "Data Lorem (Cleaned)",
                username: "Tutorial",
                workspace: "Tutorial",
                method: "FORECASTING",
                algorithm: "ARIMA",
                metrics_scores: '{"mean_squared_error": "0.038"}',
                trainDate: "2023-05-07T07:55:08.171030Z",
                feature: "",
                target: "",
                n_cluster: "",
                type: type,
              }}
            />
          </tbody>
        </table>
        <Step step={5}>
          <div className="relative">
            <StepContent position="right">
              <StepTitle>Create Forecasting Model</StepTitle>
              <StepDescription>
                To view the result of forecasating, click the <strong className="text-blue">view chart</strong> button.
              </StepDescription>
            </StepContent>
          </div>
        </Step>
      </div>
    </>
  );
}
