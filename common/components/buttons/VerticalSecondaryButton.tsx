import React from "react";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Icon, Text, TouchableRipple, useTheme } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

interface Props {
  children: string;
  onPress?: (e: GestureResponderEvent) => void;
  icon?: IconSource;
  style?: StyleProp<ViewStyle>;
}

export default function VerticalSecondaryButton({
  children,
  onPress,
  icon,
  style,
}: Props) {
  const theme = useTheme();
  const borderRadius = theme.roundness * 5;
  const color = theme.colors.primary;

  return (
    <View
      style={[
        styles.surface,
        {
          borderColor: color,
          borderRadius,
        },
        style,
      ]}
    >
      <TouchableRipple
        borderless={false}
        onPress={onPress}
        rippleColor={`${color}1f`}
        style={[styles.ripple, { borderRadius }]}
      >
        <View style={styles.content}>
          {icon ? <Icon source={icon} size={18} color={color} /> : null}
          <Text
            variant="labelLarge"
            selectable={false}
            numberOfLines={2}
            style={[styles.label, { color }]}
          >
            {children}
          </Text>
        </View>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    minWidth: 64,
    maxWidth: "100%",
    flexShrink: 1,
    backgroundColor: "transparent",
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: "solid",
    overflow: "hidden",
  },
  ripple: {
    width: "100%",
  },
  content: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  label: {
    textAlign: "center",
    alignSelf: "stretch",
  },
});
