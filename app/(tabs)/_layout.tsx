import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import ProfileIcon from "@/assets/images/profile.svg";
import { Alpha, Colors } from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: Colors.snow,
        tabBarInactiveTintColor: Colors.muted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 26 : 24}
              name="house.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorer",
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              size={focused ? 26 : 24}
              name="paperplane.fill"
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <ProfileIcon
              width={focused ? 26 : 24}
              height={focused ? 26 : 24}
              fill={color}
            />
          ),
        }}
      />

      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.navy,
    borderTopWidth: 1,
    borderTopColor: Alpha.iceBorder12,
    height: Platform.OS === "ios" ? 88 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 2,
  },
  tabBarItem: {
    paddingVertical: 4,
  },
});
