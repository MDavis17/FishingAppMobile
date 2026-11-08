import React, { useState } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

export default function DropdownSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  style,
}: Props<T>) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        onPress={() => setOpen((currentlyOpen) => !currentlyOpen)}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <View pointerEvents="none">
          <TextInput
            mode="outlined"
            label={label}
            value={selectedLabel}
            editable={false}
            right={<TextInput.Icon icon={open ? "menu-up" : "menu-down"} />}
            style={[styles.input, { backgroundColor: theme.colors.background }]}
          />
        </View>
      </Pressable>
      {open && (
        <View
          style={[
            styles.options,
            {
              borderColor: theme.colors.outline,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          {options.map((option) => {
            const selected = option.value === value;
            return (
              <Pressable
                key={option.value}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                style={({ pressed }) => [
                  styles.optionRow,
                  selected && {
                    backgroundColor: theme.colors.secondaryContainer,
                  },
                  pressed && styles.optionPressed,
                ]}
              >
                <Text
                  variant="bodyLarge"
                  style={
                    selected
                      ? { color: theme.colors.onSecondaryContainer }
                      : undefined
                  }
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
  },
  input: {
    marginVertical: 0,
  },
  options: {
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  optionRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionPressed: {
    opacity: 0.7,
  },
});
