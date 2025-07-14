import { useAppTheme } from "common/theme/ThemeContext";
import { themes } from "common/theme/themes";
import React, { useState } from "react";
import { Button, Menu } from "react-native-paper";

export default function ThemeSelector() {
  const [visible, setVisible] = useState(false);
  const { themeName, setThemeName } = useAppTheme();

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <Button mode="outlined" onPress={() => setVisible(true)}>
          {themes[themeName].name || "Choose theme"}
        </Button>
      }
    >
      {Object.entries(themes).map(([key, value]) => (
        <Menu.Item
          key={key}
          onPress={() => {
            setThemeName(key as keyof typeof themes);
            setVisible(false);
          }}
          title={value.name}
        />
      ))}
    </Menu>
  );
}
