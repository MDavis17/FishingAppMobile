import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button, Modal } from "react-native";
import { CatchEntry, FisheryType } from "types";
import { DatePickerInput } from "react-native-paper-dates";
import WaterSelector from "./WaterSelector";
import { TimeInputField } from "./TimeInputField";

interface Props {
  addNewCatch: (catchData: CatchEntry) => void;
}

export default function AddCatchModal({ addNewCatch }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [catchDate, setCatchDate] = useState<Date | undefined>(new Date());
  const [species, setSpecies] = useState("");
  const [fisherySelected, setFisherySelected] = useState<FisheryType>(
    FisheryType.Freshwater
  );

  const handleAddCatch = () => {
    const newCatch: CatchEntry = {
      id: Math.floor(10000 + Math.random() * 90000), // Random 5-digit ID
      dateTime: new Date().toISOString(),
      species,
      fisheryType: fisherySelected,
    };
    addNewCatch(newCatch);
    setSpecies(""); // Reset form fields
    setFisherySelected(FisheryType.Freshwater);
    setIsModalVisible(false); // Hide form after submission
  };

  return (
    <View style={styles.container}>
      <Button title="Add New Catch" onPress={() => setIsModalVisible(true)} />
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.dateInput}>
              <DatePickerInput
                locale="en"
                label="Catch Date"
                value={catchDate}
                onChange={(d) => setCatchDate(d)}
                inputMode="start"
                mode="outlined"
              />
            </View>

            <View style={styles.input}>
              <TimeInputField />
            </View>

            <View style={styles.input}>
              <TextInput
                placeholder="Species"
                value={species}
                onChangeText={setSpecies}
                style={styles.textInput}
              />
            </View>

            <WaterSelector
              fisherySelected={fisherySelected}
              setFisherySelected={setFisherySelected}
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={() => setIsModalVisible(false)}
                color="red"
              />
              <Button title="Log Catch" onPress={handleAddCatch} />
            </View>
          </View>
        </View>
      </Modal>
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
  // input: {
  //   height: 40,
  //   borderColor: "#ccc",
  //   borderWidth: 1,
  //   marginBottom: 10,
  //   paddingHorizontal: 10,
  //   borderRadius: 5,
  // },
  dateInput: {
    marginTop: 20,
    marginBottom: 40,
  },
  input: {
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: "row",
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "red",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  textInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
