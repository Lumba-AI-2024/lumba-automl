import axios from "axios";
import * as React from "react";
import { getCookie } from "../helper/cookies";
import useFetch from "./useFetch";
import { DetailsModalContext } from "../context/DetailsModalContext";
import useCookie from "./useCookie";

const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE;

export const WORKSPACE = API_ROUTE + "/workspace/list/";
const CUD_WORKSPACE = API_ROUTE + "/workspace/?";

export const getAllWorkspace = async (url, username) => {
  if (!username) {
    return [];
  }
  // todo: change username
  const response = await axios.get(`${url}?username=${username}`, {
    headers: {
      Authorization: `Token ${getCookie("token")}`,
    },
  });
  const { data } = response;

  return data;
};

const useWorkspaces = () => {
  const { setIsLoading, setVariant, setCustomMessage } = React.useContext(DetailsModalContext);
  const username = useCookie("username");

  const {
    data: workspaces,
    error,
    mutate,
  } = useFetch([WORKSPACE, username], ([WORKSPACE, username]) => getAllWorkspace(WORKSPACE, username));

  const addWorkspace = async (formData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(CUD_WORKSPACE, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("token")}`,
        },
      });

      const { data } = response;
      mutate([...workspaces, data]).then(() => setIsLoading(false));
    } catch (err) {
      setCustomMessage("Workspace with that name already exist");
      setVariant("error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkspace = async ({ name, username, type }, formData) => {
    const params = new URLSearchParams();
    params.append("name", name);
    params.append("username", username);
    params.append("type", type);

    try {
      setIsLoading(true);

      const nameExist = workspaces.find((ws) => ws.name === formData.name);
      if (nameExist) {
        throw new Error("Workspace name already exist");
      }

      const response = await axios.put(CUD_WORKSPACE + params, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${getCookie("token")}`,
        },
      });

      const { data } = response;

      const filteredWorkspaces = workspaces.filter((ws) => ws.name !== name);
      mutate([...filteredWorkspaces, data]).then(() => setIsLoading(false));
    } catch (err) {
      setCustomMessage("Workspace with that name already exist");
      setVariant("error");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkspace = async (data) => {
    try {
      setIsLoading(true);

      await axios.delete(CUD_WORKSPACE, {
        headers: {
          Authorization: `Token ${getCookie("token")}`,
        },
        data,
      });

      const filteredWorkspaces = workspaces.filter((ws) => ws.name !== name);
      mutate([...filteredWorkspaces]).then(() => setIsLoading(false));
    } catch (err) {
      setCustomMessage("Workspace deletion failed");
      setVariant("error");
    } finally {
      setIsLoading(false);
    }
  };

  return { workspaces, error, addWorkspace, updateWorkspace, deleteWorkspace };
};

export default useWorkspaces;
