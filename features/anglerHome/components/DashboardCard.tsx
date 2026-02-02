import PrimaryButton from "common/components/buttons/PrimaryButton";
import Divider from "common/components/Divider";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

interface Props {
  title: string;
  content?: React.ReactNode;
  hideActionFooter?: boolean;
  actionButtonText?: string;
  onActionPress?: () => void;
}

export default function DashboardCard({
  title,
  content,
  hideActionFooter = false,
  actionButtonText,
  onActionPress,
}: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <View style={styles.headerWrapper}>
        <View
          style={[styles.header, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={[styles.title, { color: theme.colors.onPrimary }]}>
            {title}
          </Text>
        </View>
      </View>
      <View style={styles.contentContainer}>{content}</View>
      {!hideActionFooter && (
        <>
          <Divider />
          <View style={styles.actionFooter}>
            <PrimaryButton onPress={onActionPress}>
              {actionButtonText ?? ""}
            </PrimaryButton>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },

  headerWrapper: {
    alignItems: "flex-start",
  },
  header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  actionFooter: {
    paddingHorizontal: 24,
    paddingBottom: 10,
  },
});
