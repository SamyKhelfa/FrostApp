import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/screen/Screen";
import { Colors } from "@/constants/colors";
import { useGetLessonQuery } from "@/core/api";
import type { ILesson } from "@/core/interfaces";

/** Carte de cours : mène au détail (chapitres + modules). */
function LessonItem({ lesson }: { lesson: ILesson }) {
  const router = useRouter();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(`/lesson/${lesson.id}`)}
    >
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{lesson.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={3}>
          {lesson.description}
        </Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const FLOATING_TAB_BAR_CONTENT_PAD = 96;

export default function CoursesScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = FLOATING_TAB_BAR_CONTENT_PAD + Math.max(insets.bottom, 14);

  const { data, isLoading, error } = useGetLessonQuery();

  if (isLoading) {
    return (
      <Screen style={styles.screen}>
        <Text style={styles.stateText}>Chargement…</Text>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen style={styles.screen}>
        <Text style={[styles.stateText, styles.errorText]}>
          Erreur de chargement des cours.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <FlatList
        data={data?.data ?? []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <LessonItem lesson={item} />}
        ListEmptyComponent={
          <Text style={styles.stateText}>Aucun cours disponible.</Text>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.appBg },
  list: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  separator: { height: 16 },

  stateText: {
    color: Colors.navyAccent,
    padding: 20,
    textAlign: "center",
  },
  errorText: {
    color: Colors.danger,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.75,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    color: Colors.navyAccent,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  cardDescription: {
    color: Colors.mutedDark,
    fontSize: 14,
    lineHeight: 20,
  },
  chevron: {
    fontSize: 28,
    color: Colors.muted,
    fontWeight: "300",
  },
});
