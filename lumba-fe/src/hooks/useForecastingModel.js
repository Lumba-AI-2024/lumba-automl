import useFetch from "./useFetch";
import axios from "axios";
import { getCookie } from "../helper/cookies";
import toast from "react-hot-toast";

const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE;

// export const MODELS = API_ROUTE + "/modeling/listmodel/";

export const getAllForecastingModels = async ({ token, username, workspace }) => {
  let { data: models } = await axios.get(
    `${
      process.env.NEXT_PUBLIC_API_ROUTE + `/forecasting/lisforecastingtmodel/`
    }?username=${username}&workspace=${workspace}`,
    {
      headers: {
        Authorization: `Token ${token || getCookie("token")}`,
      },
    }
  );

  models = models.map((model) => {
    const isDuplicate = models.some((m, i) => m.name === model.name && i !== model.id);
    return {
      id: model.id,
      modelName: model.name,
      file: model.file_name,
      metrics_scores: model.metrics_scores,
      method: "FORECASTING",
      algorithm: model.algorithm,
      target: model.target,
      steps: model.steps,
      units: model.units,
      trainDate: model.updated_time,
      features: [{ label: model.feature, isNumeric: true }],
      predict: model.target,
      period: model?.period,
      isDuplicate,
    };
  });

  return models.reverse();
};

export const addForecastingModel = async (model) => {
  const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE}/forecasting/initiateforecasting/`, model, {
    headers: {
      Authorization: `Token ${getCookie("token")}`,
    },
  });

  return data;
};

const useForecastingModel = ({ username, workspace, type }) => {
  const MODELS =
    process.env.NEXT_PUBLIC_API_ROUTE +
    `/forecasting/lisforecastingtmodel/?username=${username}&workspace=${workspace}`;
  const { data: models, mutate } = useFetch(
    MODELS,
    () => getAllForecastingModels({ url: MODELS, username, workspace }),
    {
      fallbackData: [],
    }
  );

  const deleteModel = async (model) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_API_ROUTE}/forecasting/deletemodel/`,
        {
          ...model,
          type,
        },
        {
          headers: {
            Authorization: `Token ${getCookie("token")}`,
          },
        }
      )
      .then(() => mutate(() => models.filter((model) => model.modelName !== modelName)))
      .catch(() => toast.error("Failed to delete model."));
  };

  return { models, deleteModel, mutate };
};

export default useForecastingModel;
