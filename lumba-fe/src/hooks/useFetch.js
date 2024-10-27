import useSWR from "swr";
import * as React from "react";
import { clearCookie } from "../helper/cookies";
import { useRouter } from "next/router";

const useFetch = (url, fetcher, options) => {
  const { data, error, isValidating, mutate } = useSWR(url, fetcher, options);

  const router = useRouter();

  React.useEffect(() => {
    if (error) {
      console.log(error);
      if (error?.response?.status === 401) {
        clearCookie();
        router.push("/login");
      }
    }
  }, [error]);

  return { data, error, isValidating, mutate };
};

export default useFetch;
