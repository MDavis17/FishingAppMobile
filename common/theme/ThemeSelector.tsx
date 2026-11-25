import DropdownSelect from "common/components/DropdownSelect";
import { useAppTheme } from "common/theme/ThemeContext";
import { ThemeName, themes } from "common/theme/themes";
import React from "react";

const THEME_OPTIONS = (Object.keys(themes) as ThemeName[]).map((value) => ({
  value,
  label: themes[value].name,
}));

export default function ThemeSelector() {
  const { themeName, setThemeName } = useAppTheme();

  return (
    <DropdownSelect
      label="Theme"
      value={themeName}
      options={THEME_OPTIONS}
      onChange={setThemeName}
    />
  );
}
