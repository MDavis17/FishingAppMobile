import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface Props {
  title: string;
  description: string;
  icon: ImageSourcePropType;
}

export default function ExploreCard({ title, description, icon }: Props) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.caretContainer}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={theme.colors.onSurface}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    gap: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e1e1e1",
    overflow: "hidden",
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  title: {
    fontWeight: 500,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 5,
  },
  caretContainer: {
    justifyContent: "center",
  },
  description: {
    fontSize: 12,
  },
});
