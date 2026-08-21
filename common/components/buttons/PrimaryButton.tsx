import React from "react";
import { GestureResponderEvent } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import AbstractButton from "./AbstractButton";

interface Props {
  children: string;
  onPress?: (e: GestureResponderEvent) => void;
  icon?: IconSource;
  disabled?: boolean;
}

export default function PrimaryButton({
  children,
  onPress,
  icon,
  disabled,
}: Props) {
  return (
    <AbstractButton
      mode="contained"
      textColor="white"
      onPress={onPress}
      icon={icon}
      disabled={disabled}
    >
      {children}
    </AbstractButton>
  );
}
