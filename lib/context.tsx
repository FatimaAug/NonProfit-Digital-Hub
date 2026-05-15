"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "./types";
import { loadAppState, saveAppState, defaultAppState } from "./storage";

interface AppContextType {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
  setOrganizationName: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultAppState);

  useEffect(() => {
    const loaded = loadAppState();
    setState(loaded);
  }, []);

  const updateState = (updates: Partial<AppState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      saveAppState(newState);
      return newState;
    });
  };

  const setOrganizationName = (name: string) => {
    updateState({
      organization: { ...state.organization, name },
    });
  };

  return (
    <AppContext.Provider value={{ state, updateState, setOrganizationName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
