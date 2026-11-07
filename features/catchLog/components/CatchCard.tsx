import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { CatchEntry } from "types";
import { Text, useTheme } from "react-native-paper";
import ItemCard from "common/components/ItemCard";
import { format } from "date-fns";

interface Props {
  catchItem: CatchEntry;
  onDelete: (id: number) => void;
}

export default function CatchCard({ catchItem, onDelete }: Props) {
  const theme = useTheme();

  const formattedDate = format(new Date(catchItem.dateTime), "h:mm a");

  const confirmDelete = () => {
    Alert.alert("Delete Catch", "Are you sure you want to delete this catch?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          onDelete(catchItem.id!);
        },
      },
    ]);
  };

  return (
    <ItemCard handleSelect={() => {}} confirmDelete={confirmDelete}>
      <View style={styles.textContainer}>
        <Text style={styles.catchTime}>{formattedDate}</Text>
        <Text style={[styles.fishName, { color: theme.colors.onSurface }]}>
          {catchItem.species}
        </Text>
        <Text style={styles.bait}>{catchItem.bait}</Text>
      </View>
    </ItemCard>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  catchTime: { fontSize: 12 },
  fishName: {
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 8,
  },
  bait: { fontSize: 12 },
});
