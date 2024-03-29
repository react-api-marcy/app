import { createContext, useEffect, useState } from "react";
import { CITIES } from "./components/Cities";

export const AppCtx = createContext<AppCtxData>(undefined!);

export type DefaultLocation = (typeof CITIES)[number];

export type AppCtxData = {
  darkMode: boolean;
  setDarkMode: (_: boolean) => void;
  useCurrentLocation: boolean;
  setUseCurrentLocation: (_: boolean) => void;
  defaultLocation: DefaultLocation;
  setDefaultLocation: (_: DefaultLocation) => void;
};

function getSettingsItem<T>(item: string, def: T): () => T {
  return () => {
    try {
      return JSON.parse(localStorage.getItem("settings")!)[item] as T;
    } catch (err) {
      return def;
    }
  };
}

export default function AppCtxProvider({ children }: { children: JSX.Element | JSX.Element[] }) {
  const [darkMode, setDarkMode] = useState(getSettingsItem("darkMode", false));
  const [useCurrentLocation, setUseCurrentLocation] = useState(
    getSettingsItem("useCurrentLocation", true)
  );
  const [defaultLocation, setDefaultLocation] = useState<DefaultLocation>(
    getSettingsItem("defaultLocation", "New York")
  );
  const value = {
    darkMode,
    setDarkMode,
    useCurrentLocation,
    setUseCurrentLocation,
    defaultLocation,
    setDefaultLocation,
  };
  useEffect(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({ darkMode, useCurrentLocation, defaultLocation })
    );
  }, [darkMode, useCurrentLocation, defaultLocation]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
