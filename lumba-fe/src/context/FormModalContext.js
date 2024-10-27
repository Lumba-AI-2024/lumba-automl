import React, { createContext, useState } from "react";

export const FormModalContext = createContext();

const FormModalContextProvider = ({ children }) => {
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormModalContext.Provider
      value={{
        formData,
        setFormData,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </FormModalContext.Provider>
  );
};

export default FormModalContextProvider;
