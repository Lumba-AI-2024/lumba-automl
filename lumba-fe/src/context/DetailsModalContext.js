import React, { createContext, useState } from "react";
import StatusModal from "../components/Modal/StatusModal";

export const DetailsModalContext = createContext();

const DetailsModalProvider = ({ children }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [variant, setVariant] = useState("create");
  const [isLoading, setIsLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState("");

  return (
    <DetailsModalContext.Provider
      value={{
        isDetailsOpen,
        setIsDetailsOpen,
        variant,
        setVariant,
        isLoading,
        setIsLoading,
        setCustomMessage,
      }}
    >
      {variant !== "modeling" && (
        <StatusModal
          isLoading={isLoading}
          isOpen={isDetailsOpen}
          setIsOpen={setIsDetailsOpen}
          variant={variant}
          customMessage={customMessage}
          setCustomMessage={setCustomMessage}
        />
      )}
      {children}
    </DetailsModalContext.Provider>
  );
};

export default DetailsModalProvider;
