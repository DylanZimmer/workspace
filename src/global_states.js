// AppStateContext.js
import { createContext, useState } from "react";

export const GlobalStateContext = createContext();

export const AppStateProvider = ({ children }) => {
  const [showTracker, toggleShowTracker] = useState(false);
  const [leftWidth, setLeftWidth] = useState(0);


  return (
    <GlobalStateContext.Provider
      value={{
        showTracker, toggleShowTracker,
        leftWidth, setLeftWidth,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
