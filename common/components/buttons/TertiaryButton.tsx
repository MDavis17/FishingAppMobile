import React from "react";
import { GestureResponderEvent } from "react-native";
import { Button } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import AbstractButton from "./AbstractButton";

interface Props {
  children: string;
  onPress?: (e: GestureResponderEvent) => void;
  icon?: IconSource;
  textColor?: string;
}

export default function TertiaryButton({
  children,
  onPress,
  icon,
  textColor,
}: Props) {
  return (
    <AbstractButton onPress={onPress} icon={icon} textColor={textColor}>
      {children}
    </AbstractButton>
  );
}
