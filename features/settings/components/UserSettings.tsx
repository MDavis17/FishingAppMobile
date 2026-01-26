import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Divider from "common/components/Divider";
import React from "react";
import { StyleSheet } from "react-native";
import { List } from "react-native-paper";
import { RootStackParamList } from "types";

export default function UserSettings() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <List.Section style={styles.container}>
      <List.Item
        title="Theme"
        left={() => <List.Icon icon="" />}
        onPress={() => navigation.navigate("ThemeSettings")}
      />
      <Divider />
    </List.Section>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
