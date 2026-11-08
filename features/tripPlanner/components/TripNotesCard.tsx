import Card from "common/components/Card";
import { updateTripNotes } from "features/tripPlanner/api/updateTripNotes";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";

const NOTES_MAX_LENGTH = 800;
const SAVE_DEBOUNCE_MS = 600;

interface Props {
  tripId: number;
  initialNotes?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function TripNotesCard({
  tripId,
  initialNotes,
  onFocus,
  onBlur,
}: Props) {
  const theme = useTheme();
  const [notes, setNotes] = useState(initialNotes ?? "");
  const lastSavedRef = useRef(initialNotes ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const next = initialNotes ?? "";
    setNotes(next);
    lastSavedRef.current = next;
  }, [initialNotes, tripId]);

  const persistNotes = useCallback(
    async (value: string) => {
      if (value === lastSavedRef.current) {
        return;
      }
      const { ok } = await updateTripNotes(tripId, value);
      if (ok) {
        lastSavedRef.current = value;
      }
    },
    [tripId],
  );

  const scheduleSave = useCallback(
    (value: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        void persistNotes(value);
      }, SAVE_DEBOUNCE_MS);
    },
    [persistNotes],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleChange = (value: string) => {
    setNotes(value);
    scheduleSave(value);
  };

  const handleBlur = () => {
    onBlur?.();
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    void persistNotes(notes);
  };

  const atLimit = notes.length >= NOTES_MAX_LENGTH;

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Notes
        </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            mode="outlined"
            multiline
            value={notes}
            onChangeText={handleChange}
            onFocus={onFocus}
            onBlur={handleBlur}
            placeholder="Add notes about your trip"
            maxLength={NOTES_MAX_LENGTH}
            style={styles.input}
            contentStyle={styles.inputContent}
            outlineStyle={styles.inputOutline}
          />
          <Text
            variant="labelSmall"
            style={[
              styles.counter,
              {
                color: atLimit
                  ? theme.colors.error
                  : theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {notes.length}/{NOTES_MAX_LENGTH}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 0 },
  container: { padding: 16 },
  title: { marginBottom: 12, fontWeight: "bold" },
  inputWrapper: { position: "relative" },
  input: {
    backgroundColor: "transparent",
    minHeight: 120,
  },
  inputContent: {
    minHeight: 96,
    paddingBottom: 24,
  },
  inputOutline: { borderRadius: 8 },
  counter: {
    position: "absolute",
    right: 12,
    bottom: 12,
    pointerEvents: "none",
  },
});
