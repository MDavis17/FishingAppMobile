export type AppTheme = {
  name: string;
  dark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
    onSurfaceVariant: string;
  };
};

const defaultTextColor = "#000000";
const defaultLightOnPrimary = "#ffffff";

export const SALTWATER_COLOR = "#1E5EFF";
export const FRESHWATER_COLOR = "#2E8B57";

export const YellowfinTunaTheme: AppTheme = {
  name: "Yellowfin Tuna",
  dark: false,
  colors: {
    primary: "#0077BE",
    secondary: "#FFD700",
    background: defaultLightOnPrimary,
    surface: "#E6F1F7",
    surfaceVariant: "#C2DFF1",
    onPrimary: defaultLightOnPrimary,
    onSecondary: defaultTextColor,
    onBackground: defaultTextColor,
    onSurface: defaultTextColor,
    onSurfaceVariant: defaultTextColor,
  },
};

export const SalmonTheme: AppTheme = {
  name: "Salmon",
  dark: false,
  colors: {
    primary: "#FA8072",
    secondary: "#5B8C5A",
    background: defaultLightOnPrimary,
    surface: "#F9E3DC",
    surfaceVariant: "#EAD4C4",
    onPrimary: defaultLightOnPrimary,
    onSecondary: defaultLightOnPrimary,
    onBackground: defaultTextColor,
    onSurface: defaultTextColor,
    onSurfaceVariant: defaultTextColor,
  },
};

export const LargemouthBassTheme: AppTheme = {
  name: "Largemouth Bass",
  dark: false,
  colors: {
    primary: "#4B6043",
    secondary: "#A3C586",
    background: defaultLightOnPrimary,
    surface: "#E1F0DC",
    surfaceVariant: "#C5D8B9",
    onPrimary: defaultLightOnPrimary,
    onSecondary: defaultTextColor,
    onBackground: defaultTextColor,
    onSurface: defaultTextColor,
    onSurfaceVariant: defaultTextColor,
  },
};

export const RainbowTroutTheme: AppTheme = {
  name: "Rainbow Trout",
  dark: false,
  colors: {
    primary: "#A14A76",
    secondary: "#6BA292",
    background: defaultLightOnPrimary,
    surface: "#EDE7F0",
    surfaceVariant: "#D2D6D8",
    onPrimary: defaultLightOnPrimary,
    onSecondary: defaultLightOnPrimary,
    onBackground: defaultTextColor,
    onSurface: defaultTextColor,
    onSurfaceVariant: defaultTextColor,
  },
};

export const HalibutTheme: AppTheme = {
  name: "Halibut",
  dark: false,
  colors: {
    primary: "#4E4A45",
    secondary: "#BFB3A4",
    background: defaultLightOnPrimary,
    surface: "#E0DBD6",
    surfaceVariant: "#CAC2B8",
    onPrimary: defaultLightOnPrimary,
    onSecondary: defaultTextColor,
    onBackground: defaultTextColor,
    onSurface: defaultTextColor,
    onSurfaceVariant: defaultTextColor,
  },
};

export const KelpForestTheme: AppTheme = {
  name: "Kelp Forest",
  dark: false,
  colors: {
    primary: "#2E5E4E",
    secondary: "#88A35D",
    background: defaultLightOnPrimary,
    surface: "#D6E5DC",
    surfaceVariant: "#B7D1BF",
    onPrimary: defaultLightOnPrimary,
    onSecondary: defaultTextColor,
    onBackground: defaultTextColor,
    onSurface: defaultTextColor,
    onSurfaceVariant: defaultTextColor,
  },
};

export type ThemeName =
  | "yellowfinTuna"
  | "salmon"
  | "largemouthBass"
  | "rainbowTrout"
  | "halibut"
  | "kelpForest";

export const themes: Record<ThemeName, AppTheme> = {
  yellowfinTuna: YellowfinTunaTheme,
  salmon: SalmonTheme,
  largemouthBass: LargemouthBassTheme,
  rainbowTrout: RainbowTroutTheme,
  halibut: HalibutTheme,
  kelpForest: KelpForestTheme,
};
