import { useEffect, useState } from "react";
import { getFromLocalStorage, setToLocalStorage } from "../helper/utils";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

export function useTutorial() {
  const [shouldPlay, setShouldPlay] = useState(false);
  const router = useRouter();
  const pathname = router.pathname;

  const searchParams = useSearchParams();
  const play = searchParams.get("play");

  const type = searchParams.get("type");

  //   const basePath = router.asPath.split("?")[0];

  useEffect(() => {
    if (type) {
      const value = getFromLocalStorage(pathname + type);
      if (!value) {
        setShouldPlay(true);
        setToLocalStorage(pathname + type, "value");
      }

      if (play) {
        setShouldPlay(true);
        // const params = new URLSearchParams();
        // params.set("type", type);
        // router.push(`${basePath}?${params.toString()}`, undefined, { shallow: true });
      }
    } else {
      const value = getFromLocalStorage(pathname);
      if (!value) {
        setShouldPlay(true);
        setToLocalStorage(pathname, "value");
      }

      if (play) {
        setShouldPlay(true);
        // router.push(basePath, undefined, { shallow: true });
      }
    }
  }, [play, type]);

  return shouldPlay;
}
