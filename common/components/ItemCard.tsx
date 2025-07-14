import React, { useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

interface Props {
  children: React.ReactNode;
  handleSelect?: any;
  confirmDelete?: any;
}

export default function ItemCard({
  children,
  handleSelect,
  confirmDelete,
}: Props) {
  const [isSwiping, setIsSwiping] = useState(false);
  const swipeableRef = useRef<Swipeable>(null);
  const theme = useTheme();

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        swipeableRef.current?.close();
        confirmDelete(false);
      }}
    >
      <FontAwesome name="trash" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      onSwipeableOpen={() => setIsSwiping(true)}
      onSwipeableClose={() => setIsSwiping(false)}
    >
      <TouchableOpacity onPress={handleSelect}>
        <View
          style={[
            styles.itemContainer,
            isSwiping && styles.itemContainerSwiping,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.primary,
            },
          ]}
        >
          {children}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 8,
    borderWidth: 2,
    elevation: 2,
    borderRadius: 10,
  },
  itemContainerSwiping: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
});
