import axios from "axios";
import useFetch from "./useFetch";
import { getCookie } from "../helper/cookies";

const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE;

const clientFetch = async (url) => {
  const response = await axios.get(url, {
    headers: {
      Authorization: `Token ${getCookie("token")}`,
    },
  });

  const { data } = response;

  return data;
};

export const useBarChart = (filename, workspace, username) => {
  const BAR_CHART_URL =
    API_ROUTE + `/profiling/barchart/?datasetname=${filename}&username=${username}&workspace=${workspace}`;
  const { data: barChartData, error } = useFetch(BAR_CHART_URL, clientFetch);

  return { barChartData, error };
};

export const useDescribe = (filename, workspace, username) => {
  const DESCRIBE_URL =
    API_ROUTE + `/profiling/describe/?datasetname=${filename}&username=${username}&workspace=${workspace}`;
  const { data: describeData, error } = useFetch(DESCRIBE_URL, clientFetch);

  return { describeData, error };
};

export const useColumnInfo = (filename, workspace, username, type) => {
  const DESCRIBE_URL =
    API_ROUTE + `/profiling/columninfo/?datasetname=${filename}&username=${username}&workspace=${workspace}&type=${type}`;
  const { data: columnInfo, error } = useFetch(DESCRIBE_URL, clientFetch);

  return { columnInfo, error };
};

export const useForecastingChart = ({ id, workspace, username }) => {
  const FORECASTING_CHART_URL =
    API_ROUTE + `/forecasting/forecast/?id=${id}&username=${username}&workspace=${workspace}`;
  const { data: jsonData, error } = useFetch(FORECASTING_CHART_URL, clientFetch);

  return { jsonData, error };
};
