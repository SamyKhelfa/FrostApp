import { useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen } from "@/components/screen/Screen";
import { Colors } from "@/constants/colors";
import { useGetLessonQuery, useGetLessonByIdQuery } from "@/core/api";
import type { IChapter, ILesson } from "@/core/interfaces";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Chapter (affichage simple, pas de subChapters côté API pour l'instant) ──
function ChapterItem({ chapter }: { chapter: IChapter }) {
  return (
    <View style={styles.chapterCard}>
      <Text style={styles.chapterTitle}>• {chapter.title}</Text>
      <Text style={styles.chapterDescription}>{chapter.description}</Text>
    </View>
  );
}

function LessonItem({ lesson }: { lesson: ILesson }) {
  const [chaptersOpen, setChaptersOpen] = useState(false);

  const { data: lessonDetails, isLoading } = useGetLessonByIdQuery(lesson.id, {
    skip: !chaptersOpen,
  });

  const toggleChapters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setChaptersOpen((v) => !v);
  };

  const chapters = lessonDetails?.chapters ?? [];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{lesson.title}</Text>
      <Text style={styles.cardDescription}>{lesson.description}</Text>

      <Pressable onPress={toggleChapters} style={styles.chaptersHeader}>
        <Text style={styles.chaptersLabel}>
          Chapitres{chaptersOpen ? ` (${chapters.length})` : ""}
        </Text>
        <Text style={[styles.chevron, chaptersOpen && styles.chevronOpen]}>
          ›
        </Text>
      </Pressable>

      {chaptersOpen && (
        <View style={styles.chaptersBlock}>
          {isLoading && (
            <Text style={styles.chapterDescription}>Chargement…</Text>
          )}
          <FlatList
            data={chapters}
            keyExtractor={(chapter) => chapter.id.toString()}
            scrollEnabled={false}
            renderItem={({ item: chapter }) => (
              <ChapterItem chapter={chapter} />
            )}
          />
        </View>
      )}
    </View>
  );
}

const FLOATING_TAB_BAR_CONTENT_PAD = 96;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = FLOATING_TAB_BAR_CONTENT_PAD + Math.max(insets.bottom, 14);

  const { data, isLoading, error } = useGetLessonQuery();

  if (isLoading) {
    return (
      <Screen style={styles.screen} paddingHorizontal>
        <Text style={{ color: Colors.navyAccent, padding: 20 }}>
          Chargement…
        </Text>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen style={styles.screen} paddingHorizontal>
        <Text style={{ color: Colors.danger, padding: 20 }}>
          Erreur de chargement des cours.
        </Text>
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen} paddingHorizontal>
      <FlatList
        data={data?.data ?? []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <LessonItem lesson={item} />}
      />
    </Screen>
  );
}

const NAVY = Colors.navyAccent;
const ICE = Colors.ice;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.appBg },
  list: { paddingVertical: 20 },
  separator: { height: 16 },

  card: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    color: NAVY,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  cardDescription: {
    color: "#445A77",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },

  chaptersHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#E6EBF2",
  },
  chaptersBlock: {
    marginTop: 10,
  },
  chaptersLabel: {
    color: NAVY,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  chapterCard: {
    backgroundColor: "#F2F6FB",
    borderLeftWidth: 3,
    borderLeftColor: ICE,
    borderRadius: 10,
    padding: 12,
    marginVertical: 5,
  },
  chapterTitle: {
    color: NAVY,
    fontSize: 15,
    fontWeight: "700",
  },
  chapterDescription: {
    color: "#5A6B85",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },

  chevron: {
    fontSize: 24,
    color: NAVY,
    fontWeight: "300",
    transform: [{ rotate: "90deg" }],
  },
  chevronOpen: {
    transform: [{ rotate: "270deg" }],
  },
});
