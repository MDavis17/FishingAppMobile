import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { RootStackParamList, Trip, WaterType } from "types";
import { List, Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { format } from "date-fns";
import ItemCard from "common/components/ItemCard";

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
  const theme = useTheme();

  const formattedDate = format(new Date(trip.date), "EEEE M/d/yyyy h:mm a");

  const selectTrip = () => {
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

  return (
    <ItemCard handleSelect={selectTrip} confirmDelete={confirmDelete}>
      <View style={styles.tripHeader}>
        <List.Icon
          icon={trip.waterType === WaterType.Saltwater ? "waves" : "wave"}
          style={styles.icon}
        />
        <Text style={[styles.tripTitle, { color: theme.colors.onSurface }]}>
          {trip.location.name}
        </Text>
      </View>
      <View style={styles.tripContentContainer}>
        <Text>{formattedDate}</Text>
        {trip.catchList.length > 0 && (
          <Text
            style={{
              color: theme.colors.onSurfaceVariant,
              marginTop: 4,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {trip.catchSummary}
          </Text>
        )}
      </View>
    </ItemCard>
  );
}

const styles = StyleSheet.create({
  icon: { marginRight: 12 },
  tripHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
  },
  tripTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  tripContentContainer: {
    paddingTop: 4,
    alignItems: "flex-start",
    paddingLeft: 52,
  },
});
