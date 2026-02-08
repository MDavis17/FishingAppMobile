import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { RootStackParamList, Trip } from "types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import DashboardCard from "features/anglerHome/components/DashboardCard";
import TripPreview from "./TripPreview";
import { useActionSheet } from '@expo/react-native-action-sheet';

interface Props {
  trip: Trip;
  onDelete: (id: number) => void;
  onMarkTripComplete: (id: number) => void;
}

type PlanScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Plan"
>;

export default function TripCard({ trip, onDelete, onMarkTripComplete }: Props) {
  const navigation = useNavigation<PlanScreenNavigationProp>();
  const { showActionSheetWithOptions } = useActionSheet();

  const selectTrip = () => {
    navigation.navigate("TripDetail", {
      trip,
      deleteTrip: () => {
        confirmDelete(true);
      },
      markTripComplete: () => {
        onMarkTripComplete(trip.id);
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

  const onShowTripMenu = () => {
    const options = ['Delete', 'Cancel'];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions({
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    }, (selectedIndex: number) => {
      switch (selectedIndex) {
        case destructiveButtonIndex:
          confirmDelete();
          break;
        case cancelButtonIndex:
      }});
  }

  return <View style={styles.container}>
    <TouchableOpacity onPress={selectTrip} onLongPress={onShowTripMenu}>
      <DashboardCard
        title={trip.status}
        content={<TripPreview trip={trip} />}
        hideActionFooter
      />
    </TouchableOpacity>
  </View>
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6
  }
});
