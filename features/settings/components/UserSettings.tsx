import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Divider from "common/components/Divider";
import { useAuth } from "common/context/AuthContext";
import React from "react";
import { Alert, StyleSheet } from "react-native";
import { List } from "react-native-paper";
import { RootStackParamList } from "types";

export default function UserSettings() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <List.Section style={styles.container}>
      <List.Item
        title="Theme"
        left={() => <List.Icon icon="" />}
        onPress={() => navigation.navigate("ThemeSettings")}
      />
      <Divider />
      <List.Item
        title="Log Out"
        left={() => <List.Icon icon="logout" />}
        onPress={handleLogout}
      />
    </List.Section>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
