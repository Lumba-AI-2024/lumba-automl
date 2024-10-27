import React from "react";
import { useSearchParams } from "next/navigation";
import NSteps from "../../Modeling/NSteps";
import useForecastingModel from "../../../hooks/useForecastingModel";
import { getAllForecastingModels, addForecastingModel } from "../../../hooks/useForecastingModel";
import toast from "react-hot-toast";
import Model from "../../Model";
import Input from "../../Form/Input";
import SelectTarget from "../../Modeling/SelectTarget";
import SelectFeature from "../../Modeling/SelectFeature";
import ForecastFor from "../../Modeling/ForecastFor";
import TargetForecast from "../../Modeling/TargetForecast";
import { useRouter } from "next/router";
import Seo from "../../Seo";
import Breadcrumb from "../../Breadcrumb";
import FormModalContextProvider from "../../../context/FormModalContext";
import ModelingModal from "../../Form/ModelingModal";
import Plus from "../../Icon/Plus";
import Select from "../../Select/Select";
import useModels, { addModel, getAllModels } from "../../../hooks/useModels";
import useCookie from "../../../hooks/useCookie";

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

export default function PredictingPage({ datasets }) {
  const router = useRouter();
  const { workspaceName } = router.query;

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const username = useCookie("username");
  const { models, mutate } = useModels({ username, workspace: workspaceName, type });

  const [isTraining, setIsTraining] = React.useState(false);

  const [step, setStep] = React.useState(1);

  const [method, setMethod] = React.useState("");
  const [algorithmSelected, setAlgorithmSelected] = React.useState("");

  const algorithm = algorithms[method] || [];
  const algorithmValue = algorithm[0] && algorithm[0]["value"];

  const [newModel, setNewModel] = React.useState(null);

  const step2RequiredFields = ["REGRESSION", "CLASSIFICATION"].includes(method)
    ? ["feature", "target"]
    : ["feature", "kValue"];

  const forecastingRequiredFields = ["week", "target"];

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
                handleSubmit={(formData, setFormData) => {
                  setIsTraining(true);
                  let feature = formData?.feature;
                  if (Array.isArray(feature)) {
                    feature = feature.join(",");
                  }
                  const model = {
                    modelname: formData?.modelName,
                    datasetname: formData?.dataset,
                    username: username,
                    workspace: workspaceName,
                    // method: "CLASSIFICATION",
                    // algorithm: "LOGISTIC",
                    method: formData?.method,
                    algorithm: formData?.algorithm,
                    feature: feature,
                    target: formData?.target ?? "",
                    n_cluster: formData?.kValue ?? "",
                    type: type,
                  };

                  setNewModel({
                    modelName: formData?.modelName,
                    file: formData?.dataset,
                    score: "-",
                    method: formData?.method,
                    algorithm: formData?.algorithm,
                    trainDate: Date.now(),
                    features: [
                      {
                        label: formData?.feature,
                        isNumeric: true,
                      },
                    ],
                    predict: formData?.target,
                  });

                  try {
                    addModel(model).then(() => {
                      mutate(getAllModels({ username, workspace: workspaceName })).finally(() => {
                        setIsTraining(false);
                        setFormData({});
                        setNewModel(null);
                        setStep(1);
                      });
                    });
                  } catch (err) {
                    setIsTraining(false);
                    setFormData({});
                    setNewModel(null);
                    setStep(1);
                  }
                }}
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
        {type === "object_segmentation" && (
            <FormModalContextProvider>
              <ModelingModal
                step={step}
                setStep={setStep}
                formLabel="Create Model"
                step2RequiredFields={step2RequiredFields}
                type={type}
                buttonLabel={
                  <div className="flex font-semibold items-center gap-1">
                    <Plus />
                    Create
                  </div>
                }
                submitLabel="Create"
                handleSubmit={(formData, setFormData) => {
                  setIsTraining(true);
                  let feature = formData?.feature;
                  if (Array.isArray(feature)) {
                    feature = feature.join(",");
                  }
                  const model = {
                    username: username,
                    workspace: workspaceName,
                    type: type,
                  };

                  setNewModel({
                    modelName: formData?.modelName,
                    file: formData?.dataset,
                    score: "-",
                    method: formData?.method,
                    algorithm: formData?.algorithm,
                    trainDate: Date.now(),
                    features: [
                      {
                        label: formData?.feature,
                        isNumeric: true,
                      },
                    ],
                    predict: formData?.target,
                  });

                  try {
                    addModel(model).then(() => {
                      mutate(getAllModels({ username, workspace: workspaceName })).finally(() => {
                        setIsTraining(false);
                        setFormData({});
                        setNewModel(null);
                        setStep(1);
                      });
                    });
                  } catch (err) {
                    setIsTraining(false);
                    setFormData({});
                    setNewModel(null);
                    setStep(1);
                  }
                }}
              >
                <div className={`${step === 1 ? "flex flex-col gap-2" : "hidden"}`}>
                  <Input label="Model Name" placeholder="Model name" name="modelName" required />

                  <p>Dataset</p>
                  <Select
                    placeholder="Select dataset"
                    name="dataset"
                    items={datasets?.map((dataset) => ({ value: dataset.name, label: dataset.name })) || []}
                    // items={[{value: 1, label: "fixed"}]}
                    // isDisabled={true}
                  />

                  <p>Algorithm</p>
                  <Select
                    placeholder="Select method"
                    name="method"
                    items={[
                      { value: "unett", label: "UNett" },
                      { value: "segnett", label: "SegNett" },
                      { value: "yolo", label: "YoLo" },
                    ]}
                    onChange={(formData, setFormData) => {
                      setMethod(formData.method);
                      // setFormData((previous) => ({
                      //   ...previous,
                      //   algorithm: null,
                      // }));
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

        {models?.length > 0 || isTraining ? (
          <table className="mt-4">
            <thead>
              <tr>
                <th className="px-4">Dataset & Model Name</th>
                <th className="px-4">Metric & Score</th>
                <th className="px-4">Method & Algorithm</th>
                <th className="px-4">Train Date</th>
                <th className="px-4 text-center">Actions</th>
              </tr>
              <tr className="border-b border-gray/50">
                <td colSpan="100%" className="pt-4"></td>
              </tr>
            </thead>
            <tbody>
              {isTraining && newModel && (
                <Model username={username} workspace={workspaceName} {...newModel} isLoading={true} />
              )}
              {models.map((model) => (
                <Model username={username} workspace={workspaceName} key={model.id} {...model}  />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex-1 grid place-items-center">
            <div className="flex flex-col items-center justify-center">
              <img src="/assets/LumbaEmpty.svg" alt="No Datasets Found" className="w-[280px]" />
              <div className="flex flex-col gap-4 mt-8 items-center">
                <h1 className="font-medium">No Models Found</h1>
                <span>Create your model to train and test it here</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
