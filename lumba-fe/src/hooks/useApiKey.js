import useFetch from "./useFetch";
import axios from "axios";
import { getCookie } from "../helper/cookies";

const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE;

const useApiKey = (id) => {
  const { data } = useFetch(id, async (id) => {
    const { data } = await axios.get(`${API_ROUTE}/modeling/getmodelkey/?idmodel=${id}`, {
      headers: {
        Authorization: `Token ${getCookie("token")}`,
      },
    });

    return data;
  });

  return data?.modelkey;
};

export default useApiKey;
