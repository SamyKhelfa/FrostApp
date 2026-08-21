import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, Platform, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";

const ESTIMATED_PILL_HEIGHT = 58;

const PILL_PADDING = 8;

const SPRING = {
  damping: 18,
  stiffness: 190,
  mass: 0.6,
};

type Slot = { x: number; width: number };

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [pillHeight, setPillHeight] = useState(ESTIMATED_PILL_HEIGHT);
  const [slots, setSlots] = useState<Record<number, Slot>>({});

  const safeBottom = Math.max(insets.bottom, 14);
  const bottomFillHeight = pillHeight / 2 + safeBottom;

  const visibleRoutes = state.routes
    .map((route, index) => ({ route, index }))
    .filter(({ route }) => {
      const itemStyle = descriptors[route.key].options.tabBarItemStyle as
        | { display?: string }
        | undefined;
      return itemStyle?.display !== "none";
    });

  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorScale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const hoveredIndex = useSharedValue(-1);
  const engaged = useSharedValue(false);
  const hasSettled = useRef(false);

  const slotsUI = useSharedValue<
    { index: number; x: number; width: number }[]
  >([]);

  const activeSlot = slots[state.index];

  useEffect(() => {
    slotsUI.value = visibleRoutes
      .map(({ index }) => {
        const slot = slots[index];
        return slot ? { index, x: slot.x, width: slot.width } : null;
      })
      .filter(
        (entry): entry is { index: number; x: number; width: number } =>
          Boolean(entry),
      );
  }, [slots, visibleRoutes, slotsUI]);

  useEffect(() => {
    if (!activeSlot || isDragging.value) return;

    if (hasSettled.current) {
      indicatorX.value = withSpring(activeSlot.x, SPRING);
      indicatorWidth.value = withSpring(activeSlot.width, SPRING);
    } else {
      indicatorX.value = activeSlot.x;
      indicatorWidth.value = activeSlot.width;
      hasSettled.current = true;
    }
  }, [activeSlot, indicatorX, indicatorWidth, isDragging]);

  const measure = (index: number) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setSlots((current) => {
      const previous = current[index];
      if (previous && previous.x === x && previous.width === width) {
        return current;
      }
      return { ...current, [index]: { x, width } };
    });
  };

  const snapTo = useCallback(
    (index: number) => {
      const slot = slots[index];
      if (!slot) return;
      indicatorX.value = withSpring(slot.x, SPRING);
      indicatorWidth.value = withSpring(slot.width, SPRING);
    },
    [slots, indicatorX, indicatorWidth],
  );

  const tick = useCallback(() => {
    if (Platform.OS === "ios") {
      Haptics.selectionAsync();
    }
  }, []);

  const commit = useCallback(
    (index: number) => {
      const isValid = index >= 0 && Boolean(state.routes[index]);
      const landing = isValid ? index : state.index;

      snapTo(landing);

      if (landing === state.index) return;

      const target = state.routes[landing];

      const event = navigation.emit({
        type: "tabPress",
        target: target.key,
        canPreventDefault: true,
      });

      if (event.defaultPrevented) {
        snapTo(state.index);
        return;
      }

      navigation.navigate(target.name as never);
    },
    [navigation, state.index, state.routes, snapTo],
  );

  const press = useCallback(() => {
    indicatorScale.value = withTiming(0.94, { duration: 90 });
  }, [indicatorScale]);

  const release = useCallback(() => {
    indicatorScale.value = withSpring(1, SPRING);
  }, [indicatorScale]);

  const indexAt = (fingerX: number) => {
    "worklet";
    const list = slotsUI.value;
    for (let i = 0; i < list.length; i += 1) {
      const slot = list[i];
      if (fingerX >= slot.x && fingerX <= slot.x + slot.width) {
        return slot.index;
      }
    }
    return -1;
  };

  const follow = (fingerX: number) => {
    "worklet";
    const list = slotsUI.value;
    if (list.length === 0) return;

    const first = list[0];
    const last = list[list.length - 1];

    let hovered = list[0];
    let shortest = Number.POSITIVE_INFINITY;
    for (let i = 0; i < list.length; i += 1) {
      const slot = list[i];
      const distance = Math.abs(fingerX - (slot.x + slot.width / 2));
      if (distance < shortest) {
        shortest = distance;
        hovered = slot;
      }
    }

    const width = hovered.width;
    const minX = first.x;
    const maxX = last.x + last.width - width;

    const centered = fingerX - width / 2;
    indicatorX.value = Math.min(Math.max(centered, minX), maxX);
    indicatorWidth.value = withSpring(width, SPRING);

    if (hoveredIndex.value !== hovered.index) {
      hoveredIndex.value = hovered.index;
      runOnJS(tick)();
    }
  };

  const tap = Gesture.Tap().onEnd((event) => {
    const target = indexAt(event.x - PILL_PADDING);

    if (target < 0) return;

    runOnJS(tick)();
    runOnJS(commit)(target);
  });

  const pan = Gesture.Pan()
    .minDistance(6)
    .onStart((event) => {
      engaged.value = true;
      isDragging.value = true;
      runOnJS(press)();
      follow(event.x - PILL_PADDING);
    })
    .onUpdate((event) => {
      follow(event.x - PILL_PADDING);
    })
    .onFinalize(() => {
      if (!engaged.value) return;

      engaged.value = false;
      isDragging.value = false;
      runOnJS(release)();
      runOnJS(commit)(hoveredIndex.value);
      hoveredIndex.value = -1;
    });

  const gesture = Gesture.Race(pan, tap);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: indicatorX.value },
      { scale: indicatorScale.value },
    ],
    width: indicatorWidth.value,
  }));

  return (
    <View style={styles.wrapper}>
      <View style={[styles.bottomFill, { height: bottomFillHeight }]} />

      <View style={[styles.pillRow, { paddingBottom: safeBottom }]}>
        <GestureDetector gesture={gesture}>
          <View
            style={styles.pill}
            onLayout={(e) => setPillHeight(e.nativeEvent.layout.height)}
          >
            <View style={styles.track}>
              <Animated.View
                pointerEvents="none"
                style={[styles.indicator, indicatorStyle]}
              />

              {visibleRoutes.map(({ route, index }) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const label = (options.tabBarLabel ??
                  options.title ??
                  route.name) as string;

                const icon = options.tabBarIcon?.({
                  focused: isFocused,
                  color: isFocused ? Colors.navyAccent : Colors.muted,
                  size: 22,
                });

                return (
                  <View
                    key={route.key}
                    onLayout={measure(index)}
                    style={styles.item}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: isFocused }}
                    accessibilityLabel={label}
                  >
                    {icon}
                  </View>
                );
              })}
            </View>
          </View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  bottomFill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.appBg,
  },
  pillRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  pill: {
    backgroundColor: Colors.iceBorder,
    borderRadius: 999,
    paddingHorizontal: PILL_PADDING,
    paddingVertical: PILL_PADDING,
    shadowColor: Colors.navyDeep,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 14,
  },
  track: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    shadowColor: Colors.navyDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 999,
  },
});
