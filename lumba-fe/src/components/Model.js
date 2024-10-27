import React, { useState } from "react";
import Delete from "./Icon/Delete";
import Download from "./Icon/Download";
import FormModal from "./Form/FormModal";
import FormModalContextProvider from "../context/FormModalContext";
import Spinner from "./Spinner";
import { generateTime } from "../helper/generateTime";
import TestModal from "./Form/TestModal";
import axios from "axios";
import { getCookie } from "../helper/cookies";
import ApiKey from "./Icon/ApiKey";
import useModels from "../hooks/useModels";
import ChevronDown from "./Icon/ChevronDown";
import KMeansTestModal from "./Form/KMeansTestModal";
import Button from "./Button/Button";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import useApiKey from "../hooks/useApiKey";
import { cn } from "../helper/utils";
import useForecastingModel from "../hooks/useForecastingModel";

export const metricsName = {
  mean_absolute_error: "Mean Absolute Error",
  accuracy_score: "Accuracy Score",
  r2_score: "R2 Score",
  mean_squared_error: "Mean Squared Error",
  root_mean_squared_error: "Root Mean Squared Error",
};

export const metricsNameByMethod = {
  REGRESSION: "Mean Absolute Error",
  CLASSIFICATION: "Accuracy Score",
  FORECASTING: "R2 Score",
};

const methodName = {
  REGRESSION: "Regression",
  CLASSIFICATION: "Classification",
  CLUSTERING: "Clustering",
};

const algorithmName = {
  LINEAR: "Linear Regression",
  DECISION_TREE: "Decision Tree",
  RANDOM_FOREST: "Random Forest",
  KMEANS: "K-Means",
  XG_BOOST: "XGBoost",
  NEURAL_NETWORK: "Neural Network",
  DBSCAN: "DBSCAN",
};

const TestButton = ({ onClick, type }) => {
  return (
    <Button size="small" onClick={onClick} type={type} testModel>
      Test Model
    </Button>
  );
};

const MetricsDropdown = ({ setSelectedMetrics, metrics = [], method }) => {
  const [selected, setSelected] = useState(metrics[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-1 text-[10px] text-gray -mb-1"
      >
        {selected ? metricsName[selected] : metricsNameByMethod[method]}
        <ChevronDown />
      </button>
      <div
        className={`${isOpen ? "absolute top-7 z-50 flex flex-col rounded bg-white overflow-hidden shadow" : "hidden"}`}
      >
        {metrics.map((m, i) => (
          <button
            key={m}
            className="hover:bg-blue relative hover:text-white text-left px-2 py-0.5"
            onClick={() => {
              setSelected(m);
              setSelectedMetrics(i);
              setIsOpen(false);
            }}
          >
            {m}
          </button>
        ))}
      </div>
    </>
  );
};

export default function Model({
  id,
  name,
  file,
  metrics,
  dataset,
  datasetname,
  score,
  scaler,
  // metrics_score,
  method,
  algorithm,
  updated_time,
  feature,
  predict,
  isDuplicate,
  isLoading = false,
  noActions = false,
  noShadow = false,
  username,
  workspace,
  isAuto = false,
  status,
}) {
  const [isTesting, setIsTesting] = React.useState(false);
  const [result, setResult] = React.useState("-");

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const { deleteModel } =
    type === "predicting"
      ? useModels({ username, workspace, type })
      : useForecastingModel({ workspace, username, type });
  const apiKey = type === "predicting" && useApiKey(id);
  const [selectedMetrics, setSelectedMetrics] = useState(0);

  const router = useRouter();

  const [realPath, params] = router.asPath.split("?");
  const { autoMLName, workspaceName } = router.query;
  const isHome = !realPath.split("/").includes("modeling");
  let parsedScore = null;
  parsedScore = JSON.parse(score);
  console.log(parsedScore);

  // Define the download URL
  const handleDownload = () => {
    const downloadFile = (file, name) => {
      const link = document.createElement("a");
      link.href = file;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    if (name.startsWith("vanilla")) {
      downloadFile(file, name);
    } else {
      downloadFile(file, name);
      downloadFile(scaler, name + "_scaler");
    }
  };

  return (
    <>
      <tr>
        <td colSpan="100%" className={noActions ? "pt-2" : "pt-4"}></td>
      </tr>
      <tr className="relative" onClick={() => { }}>
        <td className="bg-white rounded-l-md pl-4 py-2 relative px-4">
          <div className={`flex flex-col ${isLoading && "text-gray/50"}`}>
            <span className="text-[10px] text-gray -mb-1"></span>
            <span>{name}</span>
          </div>
        </td>
        <td className={`bg-white py-2 relative  ${isLoading && "text-gray/50"} px-4`}>
          <div className="flex flex-col">
            <span className="flex items-center gap-1 text-[10px] -mb-1">{metricsName[metrics]}</span>

            {method == "REGRESSION" && <span>{parsedScore.r2_score}</span>}
            {method == "CLASSIFICATION" && <span>{parsedScore.accuracy_score}</span>}
            {method == "CLUSTERING" && <span>{parsedScore.silhouette_score}</span>}
          </div>
        </td>
        <td className="bg-white rounded-l-md pl-4 py-2 relative px-4">
          <div className={`flex flex-col ${isLoading && "text-gray/50"}`}>
            <span>{parsedScore.time}</span>
          </div>
        </td>
        <td className={`bg-white py-2 relative ${isLoading && "text-gray/50"} px-4`}>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray -mb-1">{methodName[method]}</span>
            <span>{algorithmName[algorithm]}</span>
          </div>
        </td>
        <td className={`bg-white py-2 relative ${isLoading && "text-gray/50"} px-4`}>
          {isLoading ? "On Training..." : generateTime(updated_time)}
        </td>
        {!noActions && (
          <td
            className={cn("bg-white rounded-r-md pr-4 py-2 relative", type === "predicting" ? "w-[100px]" : "w-[50px]")}
          >
            <div className="flex gap-6 items-center justify-between relative whitespace-nowrap">
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  {type === "predicting" && <ApiKey apiKey={apiKey} />}
                  {/* Download button */}
                  <Download onClick={handleDownload} />
                  <FormModalContextProvider>
                    <FormModal
                      variant="deleteModel"
                      formLabel="Delete Model"
                      buttonLabel="Delete"
                      buttonVariant="error"
                      CustomButton={Delete}
                      submitLabel="Delete"
                      handleSubmit={(formData) => {
                        try {
                          deleteModel({
                            model_name: name.split(".")[0],
                            username: username,
                            workspace: workspace,
                            type: type,
                          });
                        } catch (err) { }
                      }}
                    >
                      <p>Are you sure you want to delete this model?</p>
                    </FormModal>
                  </FormModalContextProvider>

                  <FormModalContextProvider>
                    {["DECISION_TREE", "RANDOM_FOREST", "NEURAL_NETWORK", "XG_BOOST", "LINEAR"].includes(algorithm) && (
                      <TestModal
                        CustomButton={TestButton}
                        isTesting={isTesting}
                        features={feature}
                        predict={predict}
                        result={isTesting ? <Spinner /> : result}
                        handleSubmit={(formData) => {
                          setIsTesting(true);
                          const featureDict = Object.fromEntries(
                            Object.entries(formData).map(([key, value]) => [key, value])
                          );

                          // Mengubah dictionary menjadi string JSON
                          const featureQueryString = `feature=${JSON.stringify(featureDict)}`;
                          axios
                            .get(
                              `${process.env.NEXT_PUBLIC_API_ROUTE}/modeling/predict/?name=${name}&${featureQueryString}&username=${username}&workspace=${workspace}&datasetname=${datasetname}`,
                              {
                                headers: {
                                  Authorization: `Token ${getCookie("token")}`,
                                },
                              }
                            )
                            .then((res) => {
                              const { result } = res.data;
                              setResult(result);
                              setIsTesting(false);
                            })
                            .catch((error) => {
                              setResult(<span className="text-pink">An error occurred.</span>);
                              setIsTesting(false);
                            });
                        }}
                      />
                      // )}
                      // {algorithm === "LINEAR" && (
                      //   <TestModal
                      //     CustomButton={TestButton}
                      //     isTesting={isTesting}
                      //     features={feature}
                      //     predict={predict}
                      //     result={isTesting ? <Spinner /> : result}
                      //     handleSubmit={(formData) => {
                      //       setIsTesting(true);
                      //       axios
                      //         .get(
                      //           `${process.env.NEXT_PUBLIC_API_ROUTE}/modeling/predict/?name=${name}&feature=${formData[features[0].label]
                      //           }&username=${username}&workspace=${workspace}&type=${type}`,
                      //           {
                      //             headers: {
                      //               Authorization: `Token ${getCookie("token")}`,
                      //             },
                      //           }
                      //         )
                      //         .then((res) => {
                      //           const { result } = res.data;
                      //           setResult(result);
                      //           setIsTesting(false);
                      //         })
                      //         .catch((error) => {
                      //           setResult(<span className="text-pink">An error occurred.</span>);
                      //           setIsTesting(false);
                      //         });
                      //     }}
                      // />
                    )}
                  </FormModalContextProvider>


                </>
              )}
            </div>
          </td>
        )}
        {isAuto && (
          <td className={`bg-white py-2 px-4`}>
            <button
              className="text-blue text-[10px]"
              onClick={() => {
                router.push(`/workspace/${workspaceName}/automl/newProject/modelling/${autoMLName}/${name}`);
              }}
            >
              Explain
            </button>
          </td>
        )}
        <td className="bg-white rounded-l-md pl-4 py-2 relative px-4">
          <div className={`flex flex-col ${isLoading && "text-gray/50"}`}>
            <span>{status}</span>
          </div>
        </td>
        {!noShadow && <td colSpan="100%" className="absolute inset-0 -z-[1] w-full h-full shadow rounded-md"></td>}
      </tr>
    </>
  );
}
