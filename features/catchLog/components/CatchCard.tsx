import React, { useRef, useState } from "react";
import { TouchableOpacity, Alert, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { CatchEntry, RootStackParamList, WaterType } from "types";
import { List } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeableRef = useRef<Swipeable>(null);

  const handleSelectCatch = (catchItem: CatchEntry) => {
    navigation.navigate("CatchDetail", {
      catchItem,
      deleteCatch: () => {
        confirmDelete(true);
      },
    });
  };

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

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        swipeableRef.current?.close();
        confirmDelete(false);
      }}
    >
      <FontAwesome name="trash" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => setIsSwiping(true)}
      onSwipeableClose={() => setIsSwiping(false)}
    >
      <View
        style={[styles.itemContainer, isSwiping && styles.itemContainerSwiping]}
      >
        <TouchableOpacity onPress={() => handleSelectCatch(catchItem)}>
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
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderColor: "#eee",
    borderWidth: 1,
    elevation: 2,
    borderRadius: 10,
  },
  itemContainerSwiping: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
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
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
});
