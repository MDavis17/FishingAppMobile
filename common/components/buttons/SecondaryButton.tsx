import React from "react";
import { GestureResponderEvent } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import AbstractButton from "./AbstractButton";
import { useTheme } from "react-native-paper";

interface Props {
  children: string;
  onPress?: (e: GestureResponderEvent) => void;
  icon?: IconSource;
}

export default function SecondaryButton({ children, onPress, icon }: Props) {
  const theme = useTheme();
  return (
    <AbstractButton
      mode="outlined"
      onPress={onPress}
      icon={icon}
      borderColor={theme.colors.primary}
    >
      {children}
    </AbstractButton>
  );
}
