import React from "react";
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from "react-native";
import { RootStackParamList } from "types";
import { TimeInputField } from "./TimeInputField";
import useTimeInputField from "../hooks/useTimeInputField";
import useAddCatchForm from "../hooks/useAddCatchForm";
import { TextInput, Button, useTheme } from "react-native-paper";
import MapWindow from "common/components/MapWindow";
import SearchableDropdownInput from "common/components/SearchableDropdownInput";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import PrimaryButton from "common/components/buttons/PrimaryButton";
import SecondaryButton from "common/components/buttons/SecondaryButton";
import useSpeciesList from "features/analysis/hooks/useSpeciesList";

type NewCatchRouteProp = RouteProp<RootStackParamList, "AddNewCatch">;

export default function AddCatchForm() {
  const navigation = useNavigation();
  const theme = useTheme();
  const route = useRoute<NewCatchRouteProp>();
  const { addNewCatch } = route.params;
  const { time, setTime } = useTimeInputField();
  const {
    bait,
    setBait,
    species,
    setSpecies,
    inputError,
    setInputError,
    handleAddCatch,
    selectedLocation,
    setSelectedLocation,
    handleSelectNewLocation,
    currentLocation,
  } = useAddCatchForm(time, addNewCatch);
  const { speciesList } = useSpeciesList();

  if (!selectedLocation) {
    return;
  }

  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <ScrollView
        style={[
          styles.scrollViewContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.dateTimeContainer}>
          <View style={styles.flex}>
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
          <View style={[styles.input, styles.borderRadius, styles.timeInput]}>
            <TimeInputField time={time} setTime={setTime} />
          </View>
        </View>
        <View style={styles.flex}>
          <TextInput
            mode="outlined"
            label="Bait"
            value={bait}
            onChangeText={setBait}
            style={styles.input}
          />
        </View>
        <View style={styles.mapContainer}>
          <MapWindow isViewOnly={true} selectedLocation={selectedLocation} />
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
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            setInputError(null);
            navigation.goBack();
          }}
          labelStyle={styles.redButton}
        >
          Cancel
        </Button>
        <PrimaryButton onPress={handleAddCatch}>Log Catch</PrimaryButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
  },
  scrollViewContainer: { padding: 16 },
  modifyLocationButton: { padding: 8, opacity: 0.9 },
  form: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    flex: 1,
  },
  dateTimeContainer: { alignContent: "flex-end", flexDirection: "row" },
  input: {
    flex: 1,
    marginVertical: 6,
    backgroundColor: "white",
  },
  timeInput: { marginLeft: 8, backgroundColor: "white" },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  buttonContainer: {
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  borderRadius: { borderRadius: 5 },
  mapContainer: {
    height: 260,
    width: "100%",
    marginVertical: 12,
    borderRadius: 5,
  },
  waterSelectorContainer: { marginVertical: 12 },
  mapActionsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    paddingVertical: 8,
  },
  mapActionButton: { marginHorizontal: 4 },
  flex: { flex: 1 },
  redButton: { color: "red" },
});
