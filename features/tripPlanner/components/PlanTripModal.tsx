import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import MapWindow from "common/components/MapWindow";
import PrimaryButton from "common/components/buttons/PrimaryButton";
import SecondaryButton from "common/components/buttons/SecondaryButton";
import TertiaryButton from "common/components/buttons/TertiaryButton";
import usePlanTripForm from "../hooks/usePlanTripForm";
import SpeciesChipSelector from "./SpeciesChipSelector";

export default function PlanTripModal() {
  const theme = useTheme();
  const navigation = useNavigation();
  const {
    selectedLocation,
    setSelectedLocation,
    currentLocation,
    locationName,
    setLocationName,
    targetSpecies,
    setTargetSpecies,
    inputError,
    setInputError,
    handleSelectNewLocation,
    handleSave,
  } = usePlanTripForm();

  if (!selectedLocation) {
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.mapContainer}>
          <MapWindow isViewOnly selectedLocation={selectedLocation} />
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
                Select Location
              </SecondaryButton>
            </View>
          </View>
        </View>

        {inputError?.inputId === "location" && (
          <Text style={styles.errorText}>{inputError.message}</Text>
        )}

        <View>
          <TextInput
            mode="outlined"
            label="Location Name"
            value={locationName}
            onChangeText={setLocationName}
            style={[
              styles.input,
              inputError?.inputId === "locationName" && styles.errorInput,
            ]}
          />
          {inputError?.inputId === "locationName" && (
            <Text style={styles.errorText}>{inputError.message}</Text>
          )}
        </View>

        <SpeciesChipSelector
          selectedSpecies={targetSpecies}
          onSelectedSpeciesChange={setTargetSpecies}
        />
      </ScrollView>

      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <TertiaryButton
          onPress={() => {
            setInputError(null);
            navigation.goBack();
          }}
          textColor="red"
        >
          Cancel
        </TertiaryButton>
        <PrimaryButton onPress={handleSave}>Save Trip</PrimaryButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  mapContainer: {
    height: 260,
    width: "100%",
    marginBottom: 12,
    borderRadius: 5,
  },
  mapActionsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    paddingVertical: 8,
  },
  mapActionButton: {
    marginHorizontal: 4,
  },
  input: {
    marginVertical: 6,
    backgroundColor: "white",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
