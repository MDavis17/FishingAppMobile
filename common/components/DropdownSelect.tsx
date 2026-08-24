import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Menu, TextInput, useTheme } from "react-native-paper";

export interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
}

export default function DropdownSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: Props<T>) {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? value;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.wrapper}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TextInput
            mode="outlined"
            label={label}
            value={selectedLabel}
            editable={false}
            right={
              <TextInput.Icon icon="menu-down" onPress={openMenu} forceTextInputFocus={false} />
            }
            onPressIn={openMenu}
            style={[styles.input, { backgroundColor: theme.colors.background }]}
          />
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            onPress={() => {
              onChange(option.value);
              closeMenu();
            }}
            title={option.label}
          />
        ))}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  input: {
    marginVertical: 0,
  },
});
