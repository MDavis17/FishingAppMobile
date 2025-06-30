import React, { useState } from "react";
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from "react-native";
import { CatchEntry, RootStackParamList } from "types";
import { DatePickerInput } from "react-native-paper-dates";
import { TextInput, useTheme } from "react-native-paper";
import MapWindow from "common/components/MapWindow";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import useNewTripForm from "../hooks/useNewTripForm";
import WaterSelector from "features/catchLog/components/WaterSelector";
import PrimaryButton from "common/components/buttons/PrimaryButton";
import TertiaryButton from "common/components/buttons/TertiaryButton";
import SecondaryButton from "common/components/buttons/SecondaryButton";
import CatchList from "features/catchLog/components/CatchList";

type NewTripRouteProp = RouteProp<RootStackParamList, "NewTrip">;

export default function NewTripForm() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<NewTripRouteProp>();
  const { createNewTrip } = route.params;
  const {
    date,
    setDate,
    waterType,
    setWaterType,
    inputError,
    setInputError,
    handleAddTrip,
    selectedLocation,
    setSelectedLocation,
    handleSelectNewLocation,
    currentLocation,
    locationName,
    setLocationName,
  } = useNewTripForm(createNewTrip);

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
          <DatePickerInput
            locale="en"
            label="Trip Date"
            value={date}
            onChange={(d) => setDate(d)}
            inputMode="start"
            mode="outlined"
            style={[
              styles.input,
              inputError?.inputId === "date" && styles.errorInput,
              { marginRight: 8 },
            ]}
          />
          {inputError?.inputId === "date" && (
            <Text style={styles.errorText}>{inputError.message}</Text>
          )}
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

        <View style={styles.waterSelectorContainer}>
          <WaterSelector waterType={waterType} setWaterType={setWaterType} />
        </View>

        <View>
          <CatchList />
        </View>
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
        <PrimaryButton onPress={handleAddTrip}>Complete</PrimaryButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: { padding: 16 },
  modifyLocationButton: { padding: 8 },
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
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
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
});
