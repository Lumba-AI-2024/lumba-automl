import React from "react";
import { useSearchParams } from "next/navigation";
import Input from "../../../../src/components/Form/Input";
import NSteps from "../../Modeling/NSteps";
import ForecastFor from "../../Modeling/ForecastFor";
import TargetForecast from "../../Modeling/TargetForecast";
import { useRouter } from "next/router";
import Seo from "../../../../src/components/Seo";
import Breadcrumb from "../../../../src/components/Breadcrumb";
import FormModalContextProvider from "../../../../src/context/FormModalContext";
import ModelingModal from "../../../../src/components/Form/ModelingModal";
import Select from "../../../../src/components/Select/Select";
import useCookie from "../../../../src/hooks/useCookie";
import { Step, StepContent, StepTitle, StepDescription, useStep } from "../Steps";
import Plus from "../../../../src/components/Icon/Plus";
import Button from "../../Button/Button";

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

function CustomButton({ onClick }) {
  return (
    <Step step={1}>
      <div className="relative">
        <Button onClick={onClick}>
          <div className="flex font-semibold items-center gap-1">
            <Plus />
            Create
          </div>
        </Button>
        <StepContent position="right">
          <StepTitle>Create Forecasting Model</StepTitle>
          <StepDescription>Click this button to create your model for forecasting.</StepDescription>
        </StepContent>
      </div>
    </Step>
  );
}

export default function ForecastingTutorial1() {
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

  if (currentStep !== 1) {
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
          {type === "forecasting" && (
            <FormModalContextProvider>
              <ModelingModal
                step={step}
                setStep={setStep}
                CustomButton={CustomButton}
                submitLabel="Create"
                handleSubmit={(formData, setFormData) => {}}
              >
                <div className={`${step === 1 ? "flex flex-col gap-2" : "hidden"}`}>
                  <Input label="Model Name" placeholder="Model name" name="modelName" required />

                  <p>Dataset</p>
                  <Select
                    placeholder="Select dataset"
                    name="dataset"
                    items={[].map((dataset) => ({ value: dataset.file, label: dataset.file })) || []}
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
                  <TargetForecast username={username} workspace={workspaceName} />
                  {algorithmSelected === "LSTM" && (
                    <>
                      <NSteps />
                      <Input label="Units" placeholder="Enter value of units" name="units" required={false} />
                    </>
                  )}
                </div>
              </ModelingModal>
            </FormModalContextProvider>
          )}
        </div>

        <div className="flex-1 grid place-items-center">
          <div className="flex flex-col items-center justify-center">
            <img src="/assets/LumbaEmpty.svg" alt="No Datasets Found" className="w-[280px]" />
            <div className="flex flex-col gap-4 mt-8 items-center">
              <h1 className="font-medium">No Models Found</h1>
              <span>Create your model to train and test it here</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
