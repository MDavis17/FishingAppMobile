import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Card from "common/components/Card";
import { RootStackParamList, Trip } from "types";
import { deleteTrip as deleteTripApi } from "../api/deleteTrip";
import { markTripComplete as markTripCompleteApi } from "../api/markTripComplete";
import useTripList from "../hooks/useTripList";
import TripListFilterBar from "./TripListFilterBar";
import TripPreview from "./TripPreview";

type TripsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Trips"
>;

export default function TripList() {
  const theme = useTheme();
  const navigation = useNavigation<TripsNavigationProp>();
  const {
    isLoading,
    trips,
    filters,
    updateFilters,
    hasTrips,
    hasFilteredTrips,
    deleteTrip,
  } = useTripList();

  const handleTripPress = useCallback(
    (trip: Trip) => {
      const handleDeleteTrip = async () => {
        try {
          const response = await deleteTripApi(trip.id);

          if (!response.ok) {
            throw new Error("Failed to delete trip");
          }

          navigation.goBack();
        } catch (error) {
          console.error("Error deleting trip:", error);
        }
      };

      const handleMarkTripComplete = async () => {
        try {
          const response = await markTripCompleteApi(trip.id);

          if (!response.ok) {
            throw new Error("Failed to mark trip as complete");
          }
        } catch (error) {
          console.error("Error marking trip complete:", error);
        }
      };

      navigation.navigate("TripDetail", {
        trip,
        deleteTrip: handleDeleteTrip,
        markTripComplete: handleMarkTripComplete,
      });
    },
    [navigation]
  );

  const confirmDeleteTrip = useCallback(
    (trip: Trip) => {
      Alert.alert("Delete Trip", "Are you sure you want to delete this trip?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteTrip(trip.id);
          },
        },
      ]);
    },
    [deleteTrip]
  );

  const renderEmptyState = () => {
    if (isLoading) {
      return null;
    }

    const message = !hasTrips
      ? "No trips yet. Create a trip from the Home tab to get started."
      : "No trips match this filter.";

    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={styles.emptyText}>
          {message}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TripListFilterBar filters={filters} onFiltersChange={updateFilters} />
      <FlatList
        data={trips}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleTripPress(item)}
            onLongPress={() => confirmDeleteTrip(item)}
            style={({ pressed }) => [pressed && styles.pressedRow]}
          >
            <Card>
              <View style={styles.rowContent}>
                <TripPreview trip={item} />
              </View>
            </Card>
          </Pressable>
        )}
        contentContainerStyle={[
          styles.listContent,
          !hasFilteredTrips && styles.listContentEmpty,
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 10,
    paddingTop: 4,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  rowContent: {
    padding: 16,
  },
  separator: {
    height: 10,
  },
  pressedRow: {
    opacity: 0.85,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.7,
  },
});
