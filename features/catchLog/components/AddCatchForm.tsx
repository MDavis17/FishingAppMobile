import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { RootStackParamList } from "types";
import { DatePickerInput } from "react-native-paper-dates";
import WaterSelector from "./WaterSelector";
import { TimeInputField } from "./TimeInputField";
import useTimeInputField from "../hooks/useTimeInputField";
import useAddCatchForm from "../hooks/useAddCatchForm";
import { Button } from "react-native-paper";
import MapWindow from "common/components/MapWindow";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import PrimaryButton from "common/components/buttons/PrimaryButton";

type NewCatchRouteProp = RouteProp<RootStackParamList, "AddNewCatch">;

export default function AddCatchForm() {
  const navigation = useNavigation();
  const route = useRoute<NewCatchRouteProp>();
  const { addNewCatch } = route.params;
  const { time, setTime } = useTimeInputField();
  const {
    date,
    setDate,
    species,
    setSpecies,
    waterType,
    setWaterType,
    inputError,
    setInputError,
    handleAddCatch,
    selectedLocation,
    setSelectedLocation,
    handleSelectNewLocation,
    currentLocation,
  } = useAddCatchForm(time, addNewCatch);

  if (!selectedLocation) {
    return;
  }

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollViewContainer}>
        <View style={styles.input}>
          <TextInput
            placeholder="Species"
            value={species}
            onChangeText={setSpecies}
            style={[
              styles.textInput,
              inputError?.inputId === "species" && styles.errorInput,
            ]}
          />
          {inputError?.inputId === "species" && (
            <Text style={styles.errorText}>{inputError.message}</Text>
          )}
        </View>

        <View style={styles.dateTimeContainer}>
          <DatePickerInput
            locale="en"
            label="Catch Date"
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

          <View style={[styles.input, styles.borderRadius]}>
            <TimeInputField time={time} setTime={setTime} />
          </View>
        </View>

        <View style={styles.mapContainer}>
          <PrimaryButton
            icon="crosshairs-gps"
            onPress={() => {
              if (currentLocation) {
                setSelectedLocation(currentLocation);
              }
            }}
          >
            Use My Location
          </PrimaryButton>
          <MapWindow
            isViewOnly={true}
            selectedLocation={selectedLocation}
            height={200}
          />
          <Button
            mode="outlined"
            style={styles.modifyLocationButton}
            onPress={handleSelectNewLocation}
          >
            Modify Location
          </Button>
        </View>

        <View style={styles.waterSelectorContainer}>
          <WaterSelector waterType={waterType} setWaterType={setWaterType} />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            setInputError(null);
            navigation.goBack();
          }}
          labelStyle={{ color: "red" }}
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
