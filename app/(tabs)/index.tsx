import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/core/context/AuthContext";
import {
  useGetLessonQuery,
  useGetMyProgressQuery,
  useGetNotificationsQuery,
} from "@/core/api";

const FLOATING_TAB_BAR_PAD = 96;

function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 6) return "Belle nuit";
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bel après-midi";
  return "Bonsoir";
}

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const { data: progress, isLoading: isLoadingProgress } =
    useGetMyProgressQuery();
  const { data: lessons, isLoading: isLoadingLessons } = useGetLessonQuery();
  const { data: notifications, refetch: refetchNotifications } =
    useGetNotificationsQuery();

  useFocusEffect(
    useCallback(() => {
      refetchNotifications();
    }, [refetchNotifications]),
  );

  const unread = notifications?.unreadCount ?? 0;
  const completed = progress?.length ?? 0;
  const courses = lessons?.data ?? [];

  const firstName = user?.name?.split(" ")[0] ?? "";

  if (isLoadingProgress || isLoadingLessons) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.navyAccent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <Pressable
          style={({ pressed }) => [styles.bell, pressed && styles.pressed]}
          onPress={() => router.push("/notifications")}
          hitSlop={10}
        >
          <IconSymbol size={20} name="bell.fill" color={Colors.navyAccent} />
          {unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unread > 9 ? "9+" : unread}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: FLOATING_TAB_BAR_PAD + Math.max(insets.bottom, 14) },
        ]}
      >
        <Text style={styles.eyebrow}>{greetingFor(new Date()).toUpperCase()}</Text>
        <Text style={styles.title}>{firstName || "Bienvenue"}</Text>

        <View style={styles.statRow}>
          <StatCard
            value={completed}
            label={completed > 1 ? "modules validés" : "module validé"}
          />
          <StatCard
            value={courses.length}
            label={courses.length > 1 ? "cours disponibles" : "cours disponible"}
          />
        </View>

        <Text style={styles.sectionTitle}>Continuer</Text>

        {courses.length === 0 ? (
          <Text style={styles.empty}>
            Aucun cours pour l&apos;instant. Reviens bientôt.
          </Text>
        ) : (
          courses.slice(0, 3).map((lesson) => (
            <Pressable
              key={lesson.id}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              onPress={() => router.push(`/lesson/${lesson.id}`)}
            >
              <View style={styles.cardText}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {lesson.title}
                </Text>
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {lesson.description}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))
        )}

        {courses.length > 3 && (
          <Pressable
            style={({ pressed }) => [styles.seeAll, pressed && styles.pressed]}
            onPress={() => router.push("/(tabs)/courses")}
          >
            <Text style={styles.seeAllText}>Voir tous les cours</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.appBg },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.appBg,
  },
  pressed: { opacity: 0.72 },

  topBar: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 4,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.appBg,
  },
  badgeText: { color: Colors.snow, fontSize: 10, fontWeight: "800" },

  content: { paddingHorizontal: 24, paddingTop: 16 },
  eyebrow: {
    color: Colors.muted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 4,
  },
  title: {
    color: Colors.navyAccent,
    fontSize: 32,
    fontWeight: "300",
    fontStyle: "italic",
    marginTop: 4,
  },

  statRow: { flexDirection: "row", gap: 12, marginTop: 24 },
  stat: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  statValue: {
    color: Colors.navyAccent,
    fontSize: 30,
    fontWeight: "800",
  },
  statLabel: {
    color: Colors.mutedDark,
    fontSize: 12,
    marginTop: 2,
  },

  sectionTitle: {
    color: Colors.mutedSoft,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 30,
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 10,
  },
  cardText: { flex: 1 },
  cardTitle: {
    color: Colors.navyAccent,
    fontSize: 16,
    fontWeight: "700",
  },
  cardDescription: {
    color: Colors.mutedDark,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 3,
  },
  chevron: { color: Colors.muted, fontSize: 26, fontWeight: "300" },

  seeAll: { paddingVertical: 12, alignItems: "center" },
  seeAllText: {
    color: Colors.navyAccent,
    fontSize: 14,
    fontWeight: "700",
  },
  empty: {
    color: Colors.mutedSoft,
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
});
