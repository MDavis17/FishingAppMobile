import React, { useRef, useState } from "react";
import { TouchableOpacity, Alert, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { CatchEntry, RootStackParamList, Trip, WaterType } from "types";
import { List, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format } from "date-fns";

interface Props {
  trip: Trip;
  onDelete: (id: number) => void;
}

type PlanScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Plan"
>;

export default function TripCard({ trip, onDelete }: Props) {
  const navigation = useNavigation<PlanScreenNavigationProp>();
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeableRef = useRef<Swipeable>(null);
  const theme = useTheme();

  const formattedDate = format(new Date(trip.date), "EEEE M/d/yyyy h:mm a");

  const handleSelectCatch = (trip: Trip) => {
    navigation.navigate("TripDetail", {
      trip,
      deleteTrip: () => {
        confirmDelete(true);
      },
    });
  };

  const confirmDelete = (shouldPopNavigation = false) => {
    Alert.alert("Delete Trip", "Are you sure you want to delete this trip?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          onDelete(trip.id);
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

  const mockTrip = {
    ...trip,
    catchList: [
      { species: "Halibut" } as CatchEntry,
      { species: "Surf Perch" } as CatchEntry,
      { species: "Surf Perch" } as CatchEntry,
    ],
    catchSummary: "Halibut, Surf Perch (2)",
  };

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
        <TouchableOpacity onPress={() => handleSelectCatch(mockTrip)}>
          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 16 }}
          >
            <List.Icon
              icon={trip.waterType === WaterType.Saltwater ? "waves" : "wave"}
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: theme.colors.onSurface,
                }}
              >
                {mockTrip.location.name}
              </Text>
              <View>
                <Text>{formattedDate}</Text>
                {mockTrip.catchList.length > 0 && (
                  <Text
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      marginTop: 4,
                    }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {mockTrip.catchSummary}
                  </Text>
                )}
              </View>
            </View>
          </View>
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
