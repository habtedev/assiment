"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextType {
  realWorldMode: boolean;
  toggleRealWorldMode: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [realWorldMode, setRealWorldMode] = useState(false);

  const toggleRealWorldMode = () => {
    setRealWorldMode((prev) => !prev);
  };

  return (
    <SettingsContext.Provider value={{ realWorldMode, toggleRealWorldMode }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
