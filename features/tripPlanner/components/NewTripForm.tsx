import React from "react";
import { View, StyleSheet, Text, ScrollView, SafeAreaView } from "react-native";
import { RootStackParamList } from "types";
import { DatePickerInput } from "react-native-paper-dates";
import { Button, TextInput } from "react-native-paper";
import MapWindow from "common/components/MapWindow";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import useNewTripForm from "../hooks/useNewTripForm";
import WaterSelector from "features/catchLog/components/WaterSelector";
import PrimaryButton from "common/components/buttons/PrimaryButton";
import TertiaryButton from "common/components/buttons/TertiaryButton";
import SecondaryButton from "common/components/buttons/SecondaryButton";

type NewTripRouteProp = RouteProp<RootStackParamList, "NewTrip">;

export default function NewTripForm() {
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
    <SafeAreaView>
      <ScrollView style={styles.scrollViewContainer}>
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
          <MapWindow
            isViewOnly={true}
            selectedLocation={selectedLocation}
            height={200}
          />
          <SecondaryButton onPress={handleSelectNewLocation}>
            Modify Location
          </SecondaryButton>
        </View>

        <View>
          <TextInput
            label="Location Name"
            value={locationName}
            onChangeText={setLocationName}
            style={[
              styles.input,
              inputError?.inputId === "locationName" && styles.errorInput,
              { marginRight: 8 },
            ]}
          />
          {inputError?.inputId === "locationName" && (
            <Text style={styles.errorText}>{inputError.message}</Text>
          )}
        </View>

        <View style={styles.waterSelectorContainer}>
          <WaterSelector waterType={waterType} setWaterType={setWaterType} />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
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
  container: {
    margin: 20,
    flex: 1,
  },
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
});
