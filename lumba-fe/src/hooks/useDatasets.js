import axios from "axios";
import useFetch from "./useFetch";
import { getCookie } from "../helper/cookies";
import * as React from "react";
import { DetailsModalContext } from "../context/DetailsModalContext";

const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE;

const ADD_DATASET = API_ROUTE + "/file/";
const ADD_DATASET_OBJECT_SEGMENTATION = API_ROUTE + "/file/object-segmentation/"
const DELETE_DATASET = API_ROUTE + "/file/";

export const getAllDatasets = async (url, token) => {
  try {
    const response = await axios.get(url, 
      {
      headers: {
        Authorization: `Token ${token || getCookie("token")}`,
      },
    }
  );

    const { data } = response;

    return data.reverse();
  } catch (err) {
    console.error("Error:", err.message);
  }
};

const useDatasets = (workspace, username, type) => {
  const DATASET_URL = API_ROUTE + `/file/list/?workspace=${workspace}&username=${username}&type=${type}`;
  const { setIsLoading, setVariant, setCustomMessage } = React.useContext(DetailsModalContext);
  const {
    data: datasets,
    error,
    mutate,
  } = useFetch(DATASET_URL, () => getAllDatasets(DATASET_URL,workspace), { fallbackData: [] });

  const addDataset = async (dataset) => {
    try {
      setIsLoading(true);
      if (type !== 'object_segmentation'){
        const response = await axios.post(ADD_DATASET, dataset, {
          headers: {
            Authorization: `Token ${getCookie("token")}`,
          },
        });
        const { data } = response;
        mutate([data, ...datasets]).then(() => setIsLoading(false));
      } else {
        const response = await axios.post(ADD_DATASET_OBJECT_SEGMENTATION, dataset, {
          headers: {
            Authorization: `Token ${getCookie("token")}`,
          },
        });
        const { data } = response;
        mutate([data, ...datasets]).then(() => setIsLoading(false));
      }

    } catch (err) {
      setCustomMessage("An error occurred while uploading dataset");
      setVariant("error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateDataset = async (oldName, newName, type) => {
    try {
      setIsLoading(true);

      const nameExist = datasets.find((ds) => ds.file === newName);
      if (nameExist) {
        throw new Error("Dataset name already exist");
      }

      const UPDATE_DATASET = `${API_ROUTE}/file/?olddatasetname=${oldName}&username=${username}&workspace=${workspace}&type=${type}`;
      const formData = new FormData();
      formData.append("newdatasetname", newName);
      const response = await axios.put(UPDATE_DATASET, formData, {
        headers: {
          Authorization: `Token ${getCookie("token")}`,
        },
      });

      const { data } = response;

      const filteredDatasets = datasets.filter((ds) => ds.name !== oldName);
      mutate([...filteredDatasets, data]).then(() => setIsLoading(false));
    } catch (err) {
      setCustomMessage("Dataset with that name already exist");
      setVariant("error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDataset = async (dataset) => {
    try {
      setIsLoading(true);

      await axios.delete(DELETE_DATASET, {
        headers: {
          Authorization: `Token ${getCookie("token")}`,
        },
        data: dataset,
      });

      const filteredDatasets = datasets.filter((ds) => {
        return ds.file !== dataset.get("datasetname");
      });

      await mutate(() => [...filteredDatasets]);
      setIsLoading(false);
    } catch (err) {
      setCustomMessage("Dataset deletion failed");
      setVariant("error");
    } finally {
      setIsLoading(false);
    }
  };

  return { datasets, error, updateDataset, addDataset, deleteDataset };
};

export default useDatasets;
