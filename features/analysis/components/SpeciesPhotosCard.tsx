import { MaterialCommunityIcons } from "@expo/vector-icons";
import Card from "common/components/Card";
import { speciesImageUri } from "features/analysis/utils/imageUtils";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Species } from "types";

interface PhotoItem {
  uri: string;
  label?: string;
}

interface Props {
  species: Species;
}

const HORIZONTAL_INSET = 40;
const IMAGE_HEIGHT = 220;

function buildPhotoItems(species: Species): PhotoItem[] {
  if (species.images && species.images.length > 0) {
    return species.images.map((item) => ({
      uri: speciesImageUri(item.url),
      label: item.label,
    }));
  }

  const uri = speciesImageUri(species.image);
  if (!uri) {
    return [];
  }

  return [{ uri }];
}

interface ViewerProps {
  visible: boolean;
  items: PhotoItem[];
  initialIndex: number;
  onClose: () => void;
}

function SpeciesPhotoViewer({
  visible,
  items,
  initialIndex,
  onClose,
}: ViewerProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  React.useEffect(() => {
    if (visible) {
      setActiveIndex(initialIndex);
    }
  }, [visible, initialIndex]);

  const onViewerScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
      setActiveIndex(index);
    },
    [screenWidth],
  );

  const activeItem = items[activeIndex];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.viewerRoot,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View
          style={[
            styles.viewerHeader,
            {
              paddingTop: insets.top + 8,
              backgroundColor: theme.colors.primary,
            },
          ]}
        >
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close photo viewer"
            style={styles.viewerCloseButton}
          >
            <MaterialCommunityIcons
              name="close"
              size={28}
              color={theme.colors.onPrimary}
            />
          </Pressable>
        </View>

        <FlatList
          data={items}
          keyExtractor={(_, index) => String(index)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.viewerList}
          initialScrollIndex={items.length > 0 ? initialIndex : 0}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          onMomentumScrollEnd={onViewerScroll}
          renderItem={({ item }) => (
            <View style={[styles.viewerPage, { width: screenWidth }]}>
              <Image
                source={{ uri: item.uri }}
                style={styles.viewerImage}
                resizeMode="contain"
              />
            </View>
          )}
        />

        {activeItem?.label ? (
          <View
            style={[
              styles.viewerCaption,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            <Text variant="titleMedium" style={styles.viewerCaptionText}>
              {activeItem.label}
            </Text>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

export default function SpeciesPhotosCard({ species }: Props) {
  const theme = useTheme();
  const items = useMemo(() => buildPhotoItems(species), [species]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const pageWidth = Dimensions.get("window").width - HORIZONTAL_INSET;

  const openViewer = useCallback((index: number) => {
    setViewerIndex(index);
    setViewerVisible(true);
  }, []);

  const onCarouselScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
      setCarouselIndex(index);
    },
    [pageWidth],
  );

  if (items.length === 0) {
    return null;
  }

  const showCaptions = items.some((item) => item.label);

  return (
    <>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text variant="titleMedium">Appearance</Text>
        </View>

        {items.length === 1 ? (
          <Pressable
            onPress={() => openViewer(0)}
            accessibilityRole="button"
            accessibilityLabel="View species photo"
          >
            <Image
              source={{ uri: items[0].uri }}
              style={[styles.singleImage, { width: pageWidth }]}
              resizeMode="contain"
            />
          </Pressable>
        ) : (
          <View>
            <FlatList
              data={items}
              keyExtractor={(_, index) => String(index)}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={pageWidth}
              decelerationRate="fast"
              onMomentumScrollEnd={onCarouselScroll}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => openViewer(index)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    item.label
                      ? `View ${item.label} photo`
                      : "View species photo"
                  }
                  style={{ width: pageWidth }}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={[styles.carouselImage, { width: pageWidth }]}
                    resizeMode="contain"
                  />
                  {item.label ? (
                    <Text
                      variant="bodyMedium"
                      style={[
                        styles.carouselLabel,
                        { color: theme.colors.onSurface },
                      ]}
                    >
                      {item.label}
                    </Text>
                  ) : null}
                </Pressable>
              )}
            />
            {showCaptions ? (
              <Text variant="bodySmall" style={styles.pageIndicator}>
                {carouselIndex + 1} of {items.length}
              </Text>
            ) : null}
          </View>
        )}
      </Card>

      <SpeciesPhotoViewer
        visible={viewerVisible}
        items={items}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    paddingTop: 12,
    paddingBottom: 4,
    paddingHorizontal: 12,
  },
  header: {
    marginBottom: 8,
  },
  singleImage: {
    height: IMAGE_HEIGHT,
    alignSelf: "center",
  },
  carouselImage: {
    height: IMAGE_HEIGHT,
  },
  carouselLabel: {
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
  },
  pageIndicator: {
    textAlign: "center",
    opacity: 0.6,
    marginTop: 4,
    marginBottom: 4,
  },
  viewerRoot: {
    flex: 1,
  },
  viewerList: {
    flex: 1,
  },
  viewerHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  viewerCloseButton: {
    padding: 8,
  },
  viewerPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewerImage: {
    width: "100%",
    height: "85%",
  },
  viewerCaption: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  viewerCaptionText: {
    textAlign: "center",
  },
});
