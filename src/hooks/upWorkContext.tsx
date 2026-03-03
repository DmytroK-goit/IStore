"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface UpworkContextType {
  isUpwork: boolean;
}

const UpworkContext = createContext<UpworkContextType>({ isUpwork: false });

export const UpworkProvider = ({ children }: { children: ReactNode }) => {
  const [isUpwork, setIsUpwork] = useState(false);

  useEffect(() => {
    setIsUpwork(window.location.search.includes("upwork=true"));
  }, []);

  return (
    <UpworkContext.Provider value={{ isUpwork }}>
      {children}
    </UpworkContext.Provider>
  );
};

export const useUpwork = () => useContext(UpworkContext);