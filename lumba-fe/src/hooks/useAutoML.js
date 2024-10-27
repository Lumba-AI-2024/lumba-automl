import axios from "axios";
import useFetch from "./useFetch";
import { getCookie } from "../helper/cookies";
import * as React from "react";
import { DetailsModalContext } from "../context/DetailsModalContext";

const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE;

const ADD_AUTOML = API_ROUTE + "/automl/";
const DELETE_AUTOML = API_ROUTE + "/automl/";

export const getAllAutoML = async (url, token) => {
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

const useAutoML = (workspace, username) => {
    const AUTOML_URL = API_ROUTE + `/automl/list/?workspace=${workspace}&username=${username}`;
    const { setIsLoading, setVariant, setCustomMessage } = React.useContext(DetailsModalContext);
    const {
        data: autoMLs,
        error,
        mutate,
    } = useFetch(AUTOML_URL, () => getAllAutoML(AUTOML_URL, workspace), { fallbackData: [] });

    const addAutoML = async (autoML) => {
        try {
            setIsLoading(true);

            const response = await axios.post(ADD_AUTOML, autoML, {
                headers: {
                    Authorization: `Token ${getCookie("token")}`,
                },
            });
            const { data } = response;
            mutate([data, ...autoMLs]).then(() => setIsLoading(false));


        } catch (err) {
            setCustomMessage("An error occurred while uploading dataset");
            setVariant("error");
        } finally {
            setIsLoading(false);
        }
    };

    const updateAutoML = async (oldName, newName, type) => {
        try {
            setIsLoading(true);

            const nameExist = autoMLs.find((ml) => ml.file === newName);
            if (nameExist) {
                throw new Error("Dataset name already exist");
            }

            const UPDATE_AUTOML = `${API_ROUTE}/file/?olddatasetname=${oldName}&username=${username}&workspace=${workspace}&type=${type}`;
            const formData = new FormData();
            formData.append("newdatasetname", newName);
            const response = await axios.put(UPDATE_AUTOML, formData, {
                headers: {
                    Authorization: `Token ${getCookie("token")}`,
                },
            });

            const { data } = response;

            const filteredAutoML = autoMLs.filter((ml) => ml.name !== oldName);
            mutate([...filteredAutoML, data]).then(() => setIsLoading(false));
        } catch (err) {
            setCustomMessage("Dataset with that name already exist");
            setVariant("error");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAutoML = async (autoML) => {
        try {
            setIsLoading(true);

            await axios.delete(DELETE_AUTOML, {
                headers: {
                    Authorization: `Token ${getCookie("token")}`,
                },
                data: autoML,
            });

            const filteredAutoML = autoMLs.filter((ml) => {
                return ml.name !== autoML.get("automlname");
            });

            await mutate(() => [...filteredAutoML]);
            setIsLoading(false);
        } catch (err) {
            setCustomMessage("Dataset deletion failed");
            setVariant("error");
        } finally {
            setIsLoading(false);
        }
    };

    return { autoMLs, error, updateAutoML, addAutoML, deleteAutoML };
};

export default useAutoML;
