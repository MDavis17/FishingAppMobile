import PrimaryButton from "common/components/buttons/PrimaryButton";
import SecondaryButton from "common/components/buttons/SecondaryButton";
import MapWindow from "common/components/MapWindow";
import ThemeSelector from "common/theme/ThemeSelector";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function ThemeSettings() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Choose a theme for your app</Text>
      <ThemeSelector />
      <View style={styles.previewContainer}>
        <Text style={styles.headerText}>
          This is what your view will look like with the selected theme.
        </Text>
        <PrimaryButton>This is a button</PrimaryButton>
        <SecondaryButton>This is a another button</SecondaryButton>
        <View style={styles.mapContainer}>
          <MapWindow
            selectedLocation={{ latitude: 32.715361, longitude: -117.222639 }}
            latDelta={0.01}
            lngDelta={0.01}
            height={200}
            width={200}
            isViewOnly
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerText: { fontSize: 20, textAlign: "center" },
  previewContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    paddingTop: 10,
    paddingHorizontal: 10,
    margin: 20,
    gap: 10,
  },
  mapContainer: { flex: 1, alignItems: "center" },
});
