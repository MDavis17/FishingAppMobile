import React from "react";
import { GestureResponderEvent } from "react-native";
import { Button } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

interface Props {
  children: string;
  onPress: ((e: GestureResponderEvent) => void) | undefined;
  icon?: IconSource | undefined;
}

export default function PrimaryButton({ children, onPress, icon }: Props) {
  return (
    <Button mode="contained" textColor="white" onPress={onPress} icon={icon}>
      {children}
    </Button>
  );
}
