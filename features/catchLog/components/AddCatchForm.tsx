import React, { Dispatch, SetStateAction } from "react";
import { View, StyleSheet, TextInput, Modal, Text } from "react-native";
import { CatchEntry } from "types";
import { DatePickerInput } from "react-native-paper-dates";
import WaterSelector from "./WaterSelector";
import { TimeInputField } from "./TimeInputField";
import useTimeInputField from "../hooks/useTimeInputField";
import useAddCatchForm from "../hooks/useAddCatchForm";
import { Button } from "react-native-paper";
import MapWindow from "common/components/MapWindow";

interface Props {
  addNewCatch: (catchData: CatchEntry) => void;
  isNewCatchModalVisible: boolean;
  setIsNewCatchModalVisible: Dispatch<SetStateAction<boolean>>;
}

export default function AddCatchForm({
  addNewCatch,
  setIsNewCatchModalVisible,
}: Props) {
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
  } = useAddCatchForm(addNewCatch, time, setIsNewCatchModalVisible);
  return (
    <View>
      <View style={styles.dateInput}>
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
          ]}
        />
        {inputError?.inputId === "date" && (
          <Text style={styles.errorText}>{inputError.message}</Text>
        )}
      </View>

      <View style={styles.input}>
        <TimeInputField time={time} setTime={setTime} />
      </View>

      <View style={{ height: 230, width: "100%", marginBottom: 20 }}>
        <Button onPress={() => {}}>modify location</Button>
        <MapWindow
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
      </View>

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

      <WaterSelector waterType={waterType} setWaterType={setWaterType} />

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => {
            setInputError(null);
            setIsNewCatchModalVisible(false);
          }}
          labelStyle={{ color: "red" }}
        >
          Cancel
        </Button>
        <Button onPress={handleAddCatch}>Log Catch</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    flex: 1,
  },
  form: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    flex: 1,
  },
  dateInput: {
    marginTop: 30,
    marginBottom: 40,
  },
  input: {
    marginBottom: 20,
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
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
