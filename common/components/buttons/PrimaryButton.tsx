import React from "react";
import { GestureResponderEvent } from "react-native";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import AbstractButton from "./AbstractButton";

interface Props {
  children: string;
  onPress?: (e: GestureResponderEvent) => void;
  icon?: IconSource;
}

export default function PrimaryButton({ children, onPress, icon }: Props) {
  return (
    <AbstractButton
      mode="contained"
      textColor="white"
      onPress={onPress}
      icon={icon}
    >
      {children}
    </AbstractButton>
  );
}
