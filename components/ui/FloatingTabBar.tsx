import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const TAB_ANIMATION = {
  duration: 240,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    springDamping: 0.85,
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

const ESTIMATED_PILL_HEIGHT = 58;

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [pillHeight, setPillHeight] = useState(ESTIMATED_PILL_HEIGHT);

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

  return (
    <View style={styles.wrapper}>
      {/* White lower half — page bg stops mid-pill, white takes over below */}
      <View style={[styles.bottomFill, { height: bottomFillHeight }]} />

      <View style={[styles.pillRow, { paddingBottom: safeBottom }]}>
        <View
          style={styles.pill}
          onLayout={(e) => setPillHeight(e.nativeEvent.layout.height)}
        >
          {visibleRoutes.map(({ route, index }) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const label = (options.tabBarLabel ?? options.title ?? route.name) as string;

            const onPress = () => {
              if (Platform.OS === "ios") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                LayoutAnimation.configureNext(TAB_ANIMATION);
                navigation.navigate(route.name as never);
              }
            };

            const icon = options.tabBarIcon?.({
              focused: isFocused,
              color: isFocused ? Colors.navyAccent : Colors.muted,
              size: 22,
            });

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                style={({ pressed }) => [
                  styles.item,
                  isFocused && styles.itemActive,
                  pressed && styles.itemPressed,
                ]}
                hitSlop={6}
              >
                {icon}
                {isFocused && <Text style={styles.label}>{label}</Text>}
              </Pressable>
            );
          })}
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.iceBorder,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: Colors.navyDeep,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 14,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    minWidth: 44,
  },
  itemActive: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 18,
    shadowColor: Colors.navyDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  itemPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  label: {
    color: Colors.navyAccent,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
