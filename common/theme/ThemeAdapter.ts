import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { AppTheme } from "./themes";
import merge from "deepmerge";

export const adaptAppThemeToPaper = (appTheme: AppTheme) => {
  const base = appTheme.dark ? MD3DarkTheme : MD3LightTheme;

  return merge(base, {
    colors: {
      ...appTheme.colors,
    },
    dark: appTheme.dark,
    version: 3,
    isV3: true,
    roundness: 4,
  });
};
