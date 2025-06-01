import React, { useRef } from "react";
import { View, FlatList, StyleSheet, Dimensions, Animated } from "react-native";
import InfoSlide from "./InfoSlide";
import ConfigureSlide from "./ConfigureSlide";
import { useTheme } from "react-native-paper";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    render: ({ onNext }: { onNext: () => void }) => (
      <InfoSlide
        title="Welcome!"
        description="Your fishing guide is now in your pocket!"
        handleNext={onNext}
        isLastSlide={false}
      />
    ),
  },
  {
    key: "2",
    render: ({ onNext }: { onNext: () => void }) => (
      <InfoSlide
        title="What are your goals?"
        description="Want to catch more of one kind of fish? Want to catch more kinds of
          fish? Want to find more spots?"
        handleNext={onNext}
        isLastSlide={false}
      />
    ),
  },
  {
    key: "3",
    render: ({ onNext }: { onNext: () => void }) => (
      <ConfigureSlide handleNext={onNext} isLastSlide={false} />
    ),
  },
  {
    key: "4",
    render: ({ onNext }: { onNext: () => void }) => (
      <InfoSlide
        title="This is YOUR Fishing Journey"
        description="Any data you log will stay with you. No spot sharing or crowdsourcing."
        handleNext={onNext}
        isLastSlide={false}
      />
    ),
  },
  {
    key: "5",
    render: ({ onNext }: { onNext: () => void }) => (
      <InfoSlide
        title="Let’s Get Started"
        description="Time to fish smarter."
        handleNext={onNext}
        isLastSlide={true}
      />
    ),
  },
];

export default function OnboardingCarousel({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const theme = useTheme();
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
        renderItem={({ item, index }) =>
          item.render({ onNext: () => handleNext(index) })
        }
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
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { width: dotWidth, backgroundColor: theme.colors.primary },
              ]}
            />
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
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
