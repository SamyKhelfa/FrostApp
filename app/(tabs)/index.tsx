import { FlatList, StyleSheet, View, Text } from "react-native";

import { Screen } from "@/components/screen/Screen";

import {LESSONS} from "@/data/lessons.mock";
import {Image} from "expo-image";

export default function HomeScreen() {
  return (
    <Screen style={styles.screen} paddingHorizontal>
      <FlatList
        data={LESSONS}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <View style={styles.chaptersBlock}>
                  <Text style={styles.chaptersLabel}>Chapitres</Text>
                  <FlatList
                      data={item.chapters}
                      keyExtractor={(chapter) => chapter.id.toString()}
                      scrollEnabled={false}
                      renderItem={({ item: chapter }) => (
                          <View style={styles.chapterCard}>
                              <Text style={styles.chapterTitle}>• {chapter.title}</Text>
                              <Text style={styles.chapterDescription}>{chapter.description}</Text>

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
                          </View>
                      )}
                  />
              </View>
          </View>
        )}
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


  chaptersBlock: {
      marginTop: 16,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: "#E6EBF2",
  },
  chaptersLabel: {
      color: NAVY,
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 2,
      textTransform: "uppercase",
      marginBottom: 10,
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
