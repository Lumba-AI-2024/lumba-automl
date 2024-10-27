import * as React from "react";
import { getCookie } from "../helper/cookies";

// how to use:
// const username = useCookie('username');

// or

// const [usernamename, token] = useCookie(['usernamename', 'token']);

const useCookie = (cname) => {
  const [cookies, setCookies] = React.useState(null);

  React.useEffect(() => {
    if (typeof cname === "string") {
      const item = getCookie(cname);
      setCookies(item);
      return;
    }

    const items = cname.map((name) => getCookie(name));
    setCookies(items);
  }, []);

  return cookies;
};

export default useCookie;
