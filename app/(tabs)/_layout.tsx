import { Tabs } from "expo-router";
import React from "react";

import { FloatingTabBar } from "@/components/ui/FloatingTabBar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import ProfileIcon from "@/assets/images/profile.svg";
import LessonIcon from "@/assets/images/lesson.svg";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: "absolute" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Cours",
          // lesson.svg est tracé en contour : on colore le stroke, pas le fill
          tabBarIcon: ({ color }) => (
            <LessonIcon width={22} height={22} stroke={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorer",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={22} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <ProfileIcon width={22} height={22} fill={color} />
          ),
        }}
      />

    </Tabs>
  );
}
