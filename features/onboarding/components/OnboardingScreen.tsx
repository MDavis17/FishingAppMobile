import React, { useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  { key: "1", title: "Welcome!", description: "Your fishing log made easy." },
  {
    key: "2",
    title: "Log Catches",
    description: "Record your best catches fast.",
  },
  {
    key: "3",
    title: "Track Conditions",
    description: "Save tide, temp, and more.",
  },
  {
    key: "4",
    title: "Review Insights",
    description: "Analyze your fishing patterns.",
  },
  {
    key: "5",
    title: "Let’s Get Started",
    description: "Time to fish smarter.",
  },
];

export default function OnboardingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleNext = (index: number) => {
    if (index < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <TouchableOpacity
              onPress={() => handleNext(index)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {index === slides.length - 1 ? "Get Started" : "Next"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.indicatorContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });
          return (
            <Animated.View key={i} style={[styles.dot, { width: dotWidth }]} />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  slide: {
    width,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, textAlign: "center", marginBottom: 40 },
  button: {
    backgroundColor: "#007aff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007aff",
    marginHorizontal: 4,
  },
});
