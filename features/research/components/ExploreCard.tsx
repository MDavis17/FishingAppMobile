import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";

interface Props {
  title: string;
  icon: ImageSourcePropType;
  iconBackgroundColor: string;
  onPress?: () => void;
}

export default function ExploreCard({
  title,
  icon,
  iconBackgroundColor,
  onPress,
}: Props) {
  const theme = useTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View
        style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}
      >
        <Image source={icon} style={styles.icon} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.caretContainer}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={theme.colors.onSurface}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
    gap: 10,
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  icon: {
    width: 40,
    height: 40,
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
});
