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

import { Screen } from "@/components/screen/Screen";

import { LESSONS, type Chapter, type Lesson } from "@/data/lessons.mock";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function ChapterItem({ chapter }: { chapter: Chapter }) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <View style={styles.chapterCard}>
      <Pressable onPress={toggle} style={styles.chapterHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.chapterTitle}>• {chapter.title}</Text>
          <Text style={styles.chapterDescription}>{chapter.description}</Text>
          <Text style={styles.chapterMeta}>
            {chapter.subChapters.length} vidéo
            {chapter.subChapters.length > 1 ? "s" : ""}
          </Text>
        </View>
        <Text style={[styles.chevron, expanded && styles.chevronOpen]}>›</Text>
      </Pressable>

      {expanded && (
        <FlatList
          data={chapter.subChapters}
          keyExtractor={(sub) => sub.id.toString()}
          scrollEnabled={false}
          renderItem={({ item: sub }) => (
            <View style={styles.subChapterRow}>
              <Text style={styles.subChapterTitle}>↳ {sub.title}</Text>
              <Text style={styles.subChapterMeta}>
                {sub.duration}s · {sub.description}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

function LessonItem({ lesson }: { lesson: Lesson }) {
  const [chaptersOpen, setChaptersOpen] = useState(false);

  const toggleChapters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setChaptersOpen((v) => !v);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{lesson.title}</Text>
      <Text style={styles.cardDescription}>{lesson.description}</Text>

      <Pressable onPress={toggleChapters} style={styles.chaptersHeader}>
        <Text style={styles.chaptersLabel}>
          Chapitres ({lesson.chapters.length})
        </Text>
        <Text style={[styles.chevron, chaptersOpen && styles.chevronOpen]}>
          ›
        </Text>
      </Pressable>

      {chaptersOpen && (
        <View style={styles.chaptersBlock}>
          <FlatList
            data={lesson.chapters}
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

export default function HomeScreen() {
  return (
    <Screen style={styles.screen} paddingHorizontal>
      <FlatList
        data={LESSONS}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <LessonItem lesson={item} />}
      />
    </Screen>
  );
}

const NAVY = "#1A395D";
const ICE = "#B8D4F0";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0E2645" },
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
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  chapterMeta: {
    color: "#8294AD",
    fontSize: 10.5,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "600",
    marginTop: 4,
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

  subChapterRow: {
    marginLeft: 12,
    marginTop: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#D4E2F2",
  },
  subChapterTitle: {
    color: NAVY,
    fontSize: 13,
    fontWeight: "600",
  },
  subChapterMeta: {
    color: "#8294AD",
    fontSize: 11,
    marginTop: 1,
  },
});
