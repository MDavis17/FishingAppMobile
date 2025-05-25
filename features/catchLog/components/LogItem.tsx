import React from "react";
import { TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { CatchEntry, RootStackParamList, WaterType } from "types";
import { List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface Props {
  item: CatchEntry;
  onDelete: (id: number) => void;
}

type LogsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Logs"
>;

export const LogItem = ({ item, onDelete }: Props) => {
  const navigation = useNavigation<LogsScreenNavigationProp>();

  const handleSelectCatch = (catchItem: CatchEntry) => {
    navigation.navigate("CatchDetail", { catchItem });
  };

  const confirmDelete = () => {
    Alert.alert("Delete Catch", "Are you sure you want to delete this catch?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => onDelete(item.id),
      },
    ]);
  };

  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
      <FontAwesome name="trash" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={() => handleSelectCatch(item)}>
        <List.Item
          title={item.dateTime}
          description={item.species}
          left={(props) => (
            <List.Icon
              {...props}
              icon={item.waterType === WaterType.Saltwater ? "waves" : "wave"}
            />
          )}
        />
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    padding: 16,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
  },
  subtext: {
    fontSize: 12,
    color: "gray",
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
});
