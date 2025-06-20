import React from "react";
import { GestureResponderEvent } from "react-native";
import { Button } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

interface Props {
  children: string;
  onPress?: (e: GestureResponderEvent) => void;
  icon?: IconSource;
  textColor?: string;
  mode?: "text" | "contained" | "outlined" | "elevated" | "contained-tonal";
}

export default function AbstractButton({
  children,
  onPress,
  icon,
  textColor,
  mode,
}: Props) {
  return (
    <Button mode={mode} onPress={onPress} icon={icon} textColor={textColor}>
      {children}
    </Button>
  );
}
