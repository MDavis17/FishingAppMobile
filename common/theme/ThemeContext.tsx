import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { themes, ThemeName } from "./themes";
import { adaptAppThemeToPaper } from "./ThemeAdapter";
import type { MD3Theme } from "react-native-paper";

interface ThemeContextProps {
  theme: MD3Theme;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: themes.yellowfinTuna,
  themeName: "yellowfinTuna",
  setThemeName: () => {},
});

export const useAppTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeNameState] = useState<ThemeName>("yellowfinTuna");

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("app-theme");
      if (stored && stored in themes) {
        setThemeNameState(stored as ThemeName);
      }
    })();
  }, []);

  const setThemeName = async (name: ThemeName) => {
    setThemeNameState(name);
    await AsyncStorage.setItem("app-theme", name);
  };

  const theme = adaptAppThemeToPaper(themes[themeName] || themes.yellowfinTuna);

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};
