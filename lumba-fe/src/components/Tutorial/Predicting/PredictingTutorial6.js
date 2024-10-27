import React from "react";
import { useSearchParams } from "next/navigation";
import Input from "../../../../src/components/Form/Input";
import SelectTarget from "../../../../src/components/Modeling/SelectTarget";
import SelectFeature from "../../../../src/components/Modeling/SelectFeature";
import { useRouter } from "next/router";
import Seo from "../../../../src/components/Seo";
import Breadcrumb from "../../../../src/components/Breadcrumb";
import FormModalContextProvider from "../../../../src/context/FormModalContext";
import ModelingModal from "../../../../src/components/Form/ModelingModal";
import Plus from "../../../../src/components/Icon/Plus";
import Select from "../../../../src/components/Select/Select";
import useCookie from "../../../../src/hooks/useCookie";
import { useStep } from "../Steps";
import ModelTutorial from "./ModelTutorial";
import TestModalTutorial from "./TestModalTutorial";
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

const TestButton = ({ onClick, type }) => {
  return (
    <Button size="small" onClick={onClick} type={type} testModel>
      Test Model
    </Button>
  );
};

export default function PredictingTutorial6({ datasets }) {
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

  if (currentStep !== 6) {
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
          {type === "predicting" && (
            <FormModalContextProvider>
              <ModelingModal
                step={step}
                setStep={setStep}
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

                  <p>Method</p>
                  <Select
                    placeholder="Select method"
                    name="method"
                    items={[
                      { value: "REGRESSION", label: "Regression" },
                      { value: "CLASSIFICATION", label: "Classification" },
                      { value: "CLUSTERING", label: "Clustering" },
                    ]}
                    onChange={(formData, setFormData) => {
                      setMethod(formData.method);
                      setFormData((previous) => ({
                        ...previous,
                        algorithm: null,
                      }));
                    }}
                  />

                  <p>Algorithm</p>
                  <Select
                    placeholder="Select algorithm"
                    name="algorithm"
                    items={algorithm}
                    onChange={(formData, setFormData) => {
                      setAlgorithmSelected(formData.algorithm);
                    }}
                  />
                </div>
                <div className={`${step === 2 ? "flex flex-col gap-2" : "hidden"}`}>
                  <SelectFeature username={username} workspace={workspaceName} algorithmSelected={algorithmSelected} />
                  {algorithmValue === "KMEANS" ? (
                    <Input
                      type="number"
                      label="K Value"
                      max={50}
                      placeholder="Enter value of k (max. 50)"
                      name="kValue"
                      required
                    />
                  ) : (
                    <SelectTarget username={username} workspace={workspaceName} />
                  )}
                </div>
              </ModelingModal>
            </FormModalContextProvider>
          )}
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
            <ModelTutorial
              username={"Tutorial"}
              workspace={"Tutorial"}
              {...{
                modelName: "My Reg Model",
                file: "Data Lorem (Cleaned)",
                username: "Tutorial",
                workspace: "Tutorial",
                method: "REGRESSION",
                algorithm: "LINEAR",
                metrics_scores: '{"mean_absolute_error": "0.0008"}',
                trainDate: "2023-05-07T07:55:08.171030Z",
                feature: "",
                target: "",
                n_cluster: "",
                type: type,
              }}
            />
          </tbody>
        </table>

        <FormModalContextProvider>
          <TestModalTutorial
            open={true}
            CustomButton={TestButton}
            isTesting={false}
            features={""}
            predict={""}
            result={"-"}
            handleSubmit={(formData) => {}}
          />
        </FormModalContextProvider>
      </div>
    </>
  );
}
