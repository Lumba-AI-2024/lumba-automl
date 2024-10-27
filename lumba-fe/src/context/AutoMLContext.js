// src/context/AutoMLContext.js
import React, { createContext, useRef } from 'react';

export const AutoMLContext = createContext();

export const AutoMLProvider = ({ children }) => {
  const autoMLDataRef = useRef(new FormData());

  const appendAutoMLData = (newData) => {
    const autoMLData = autoMLDataRef.current;
    for (const [key, value] of Object.entries(newData)) {
      autoMLData.append(key, value);
    }
  };

  return (
    <AutoMLContext.Provider value={{ autoMLData: autoMLDataRef.current, appendAutoMLData }}>
      {children}
    </AutoMLContext.Provider>
  );
};
