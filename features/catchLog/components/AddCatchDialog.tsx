import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput, Surface, useTheme, Text } from "react-native-paper";
import MapWindow from "common/components/MapWindow";
import SearchableDropdownInput from "common/components/SearchableDropdownInput";
import PrimaryButton from "common/components/buttons/PrimaryButton";
import SecondaryButton from "common/components/buttons/SecondaryButton";
import TertiaryButton from "common/components/buttons/TertiaryButton";
import useAddCatchForm from "../hooks/useAddCatchForm";
import useSpeciesList from "features/analysis/hooks/useSpeciesList";
import { CatchEntry } from "types";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  addNewCatch: (tripId: number, newCatch: CatchEntry) => void | Promise<void>;
}

export default function AddCatchDialog({
  visible,
  onDismiss,
  addNewCatch,
}: Props) {
  const theme = useTheme();
  const { speciesList } = useSpeciesList();
  const {
    bait,
    setBait,
    species,
    setSpecies,
    date,
    onTimeChange,
    inputError,
    setInputError,
    handleAddCatch,
    selectedLocation,
    setSelectedLocation,
    currentLocation,
    handleSelectNewLocation,
  } = useAddCatchForm({
    addNewCatch,
    onSuccess: onDismiss,
    visible,
  });

  if (!visible || !selectedLocation) {
    return null;
  }

  const handleDismiss = () => {
    setInputError(null);
    onDismiss();
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleDismiss} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.centered}
        pointerEvents="box-none"
      >
        <Surface
          style={[styles.card, { backgroundColor: theme.colors.surface }]}
          elevation={4}
        >
          <Text variant="titleMedium" style={styles.title}>
            Log Catch
          </Text>

          <View style={styles.speciesRow}>
            <View style={styles.speciesInput}>
              <SearchableDropdownInput
                options={speciesList}
                value={speciesList.find((s) => s.name === species) ?? null}
                onSelect={(s) => setSpecies(s ? s.name : "")}
                getOptionLabel={(s) => s.name}
                getOptionKey={(s) => s.id}
                placeholder="Search species..."
                label="Species"
                fuzzy
                error={inputError?.inputId === "species"}
              />
              {inputError?.inputId === "species" && (
                <Text style={styles.errorText}>{inputError.message}</Text>
              )}
            </View>
            <View style={styles.timeInput}>
              <DateTimePicker
                value={date ?? new Date()}
                mode="time"
                display="default"
                onChange={(_, selectedDate) => onTimeChange(selectedDate)}
              />
            </View>
          </View>

          <TextInput
            mode="outlined"
            label="Bait"
            value={bait}
            onChangeText={setBait}
            style={styles.baitInput}
          />

          <View style={styles.mapContainer}>
            <MapWindow
              height={140}
              selectedLocation={selectedLocation}
              isViewOnly
            />
          </View>
          <View style={styles.mapActionsContainer}>
            <View style={styles.mapActionButton}>
              <SecondaryButton
                icon="crosshairs-gps"
                onPress={() => {
                  if (currentLocation) {
                    setSelectedLocation(currentLocation);
                  }
                }}
              >
                Use My Location
              </SecondaryButton>
            </View>
            <View style={styles.mapActionButton}>
              <SecondaryButton onPress={handleSelectNewLocation}>
                Modify Location
              </SecondaryButton>
            </View>
          </View>

          <View style={styles.footer}>
            <TertiaryButton onPress={handleDismiss} textColor="red">
              Cancel
            </TertiaryButton>
            <PrimaryButton onPress={handleAddCatch}>Log Catch</PrimaryButton>
          </View>
        </Surface>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 12,
    padding: 16,
    overflow: "visible",
  },
  title: {
    marginBottom: 12,
  },
  speciesRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    zIndex: 10,
  },
  speciesInput: {
    flex: 1,
    marginRight: 8,
    zIndex: 10,
  },
  timeInput: {
    justifyContent: "center",
    paddingTop: 8,
  },
  baitInput: {
    marginTop: 8,
    backgroundColor: "white",
  },
  mapContainer: {
    height: 140,
    width: "100%",
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  mapActionsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    paddingTop: 8,
  },
  mapActionButton: {
    marginHorizontal: 4,
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
});
