import { useHeaderHeight } from "@react-navigation/elements";
import { RouteProp, useRoute } from "@react-navigation/native";
import TertiaryButton from "common/components/buttons/TertiaryButton";
import AddCatchDialog from "features/catchLog/components/AddCatchDialog";
import useCatchList from "features/catchLog/hooks/useCatchList";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { RootStackParamList, Trip } from "types";
import { useTripContext } from "./TripContext";
import PrimaryButton from "common/components/buttons/PrimaryButton";
import TripDetailHeader from "./TripDetailHeader";
import TripLocationCard from "./TripLocationCard";
import TripCatchSummary from "./TripCatchSummary";
import TripNotesCard from "./TripNotesCard";
import TripConditionsCard from "./TripConditionsCard";

type TripDetailRouteProp = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetail() {
  const theme = useTheme();
  const headerHeight = useHeaderHeight();
  const { setTrip } = useTripContext();
  const route = useRoute<TripDetailRouteProp>();
  const { trip, deleteTrip, markTripComplete } = route.params;
  const { date, location } = trip;
  const [status, setStatus] = useState<Trip["status"]>(trip.status);
  const [addCatchVisible, setAddCatchVisible] = useState(false);
  const { isLoading, catchList, addNewCatch } = useCatchList(trip.id);
  const scrollRef = useRef<ScrollView>(null);
  const notesFocusedRef = useRef(false);

  useEffect(() => {
    setStatus(trip.status);
    setTrip(trip);
  }, [setTrip, trip]);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const subscription = Keyboard.addListener(showEvent, () => {
      if (notesFocusedRef.current) {
        scrollRef.current?.scrollToEnd({ animated: true });
      }
    });
    return () => subscription.remove();
  }, []);

  const handleCompleteTrip = () => {
    markTripComplete();
    setStatus("Completed");
  };

  const handleNotesFocus = () => {
    notesFocusedRef.current = true;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  };

  const handleNotesBlur = () => {
    notesFocusedRef.current = false;
  };

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
      >
        <TripDetailHeader
          status={status}
          title={location.name}
          date={date}
          tripType={trip.tripType}
        />
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <TripLocationCard location={location} />
          <TripConditionsCard location={location} date={date} />
          <TripCatchSummary
            catchList={catchList}
            isLoading={isLoading}
            onAddCatchPress={() => setAddCatchVisible(true)}
          />
          <TripNotesCard
            tripId={trip.id}
            initialNotes={trip.notes}
            onFocus={handleNotesFocus}
            onBlur={handleNotesBlur}
          />
          <View style={styles.footerContainer}>
            {status === "Planned" && (
              <PrimaryButton onPress={handleCompleteTrip}>
                Mark Trip Complete
              </PrimaryButton>
            )}
            <TertiaryButton onPress={deleteTrip} textColor="red">
              Delete
            </TertiaryButton>
          </View>
        </View>
        <AddCatchDialog
          visible={addCatchVisible}
          onDismiss={() => setAddCatchVisible(false)}
          addNewCatch={addNewCatch}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: { flex: 4, padding: 16, gap: 8 },
  footerContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});
