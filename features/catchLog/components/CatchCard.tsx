import React from "react";
import { Alert } from "react-native";
import { CatchEntry, RootStackParamList, WaterType } from "types";
import { List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import ItemCard from "common/components/ItemCard";

interface Props {
  catchItem: CatchEntry;
  onDelete: (id: number) => void;
}

type LogsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Logs"
>;

export default function CatchCard({ catchItem, onDelete }: Props) {
  const navigation = useNavigation<LogsScreenNavigationProp>();

  const confirmDelete = (shouldPopNavigation = false) => {
    Alert.alert("Delete Catch", "Are you sure you want to delete this catch?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          onDelete(catchItem.id);
          if (shouldPopNavigation) {
            navigation.goBack();
          }
        },
      },
    ]);
  };

  return (
    <ItemCard handleSelect={() => {}} confirmDelete={confirmDelete}>
      <List.Item
        title={catchItem.dateTime}
        description={catchItem.species}
        left={(props) => (
          <List.Icon
            {...props}
            icon={
              catchItem.waterType === WaterType.Saltwater ? "waves" : "wave"
            }
          />
        )}
      />
    </ItemCard>
  );
}
