import React, { createContext, useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import { getCookie } from "../helper/cookies";
import { getUser } from "../../pages/settings";
import axios from "axios";
import { toast } from "react-hot-toast";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

const UserProvider = ({ children }) => {
  const username = getCookie("username");
  const token = getCookie("token");
  const {
    data: user,
    isValidating,
    mutate,
  } = useFetch(
    token ? `${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/get_user/?username=${getCookie("username")}` : null,
    () => getUser(username, token)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);

  const changeProfile = (changeEvent) => {
    const reader = new FileReader();

    const form = changeEvent.currentTarget;
    const fileInput = Array.from(form.elements).find((element) => element?.name === "image");

    const formData = new FormData();

    for (const file of fileInput?.files) {
      formData.append("profile_picture", file);
    }

    reader.onload = (onLoadEvent) => {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_ROUTE}/authentication/update_user_picture/?username=${getCookie("username")}`,
          formData,
          {
            headers: {
              Authorization: `Token ${getCookie("token")}`,
            },
          }
        )
        .then(() => {
          mutate().then(() => toast.success("Profile picture changed."));
        })
        .catch(() => toast.error("Profile picture failed to save."));
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  };

  React.useEffect(() => {
    setUpdatedUser(user);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        isValidating,
        isLoading,
        setIsLoading,
        updatedUser,
        setUpdatedUser,
        changeProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
