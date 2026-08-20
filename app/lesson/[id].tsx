import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Colors } from "@/constants/colors";
import { useGetLessonByIdQuery } from "@/core/api";
import type { ISubchapter } from "@/core/interfaces";

function ModuleRow({
  subchapter,
  onPress,
}: {
  subchapter: ISubchapter;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{subchapter.title}</Text>
        {!!subchapter.description && (
          <Text style={styles.rowDescription} numberOfLines={2}>
            {subchapter.description}
          </Text>
        )}
      </View>

      <View style={styles.circle} />
    </Pressable>
  );
}

export default function LessonDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    data: lesson,
    isLoading,
    error,
  } = useGetLessonByIdQuery(Number(id));

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.navyAccent} />
      </SafeAreaView>
    );
  }

  if (error || !lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.padded}>
          <ScreenHeader eyebrow="COURS" title="Introuvable" />
          <Text style={styles.emptyText}>
            Ce cours n&apos;existe pas ou n&apos;est plus disponible.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const sections = (lesson.chapters ?? []).map((chapter) => ({
    title: chapter.title,
    count: chapter.subChapters?.length ?? 0,
    data: chapter.subChapters ?? [],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <>
            <ScreenHeader eyebrow="COURS" title={lesson.title} />
            {!!lesson.description && (
              <Text style={styles.lessonDescription}>{lesson.description}</Text>
            )}
          </>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionCount}>
              {section.count} {section.count > 1 ? "modules" : "module"}
            </Text>
          </View>
        )}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? (
            <Text style={styles.sectionEmpty}>Aucun module pour l&apos;instant.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <ModuleRow
            subchapter={item}
            onPress={() => router.push(`/subchapter/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Ce cours ne contient pas encore de chapitre.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBg,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.appBg,
  },
  padded: {
    padding: 24,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },

  lessonDescription: {
    color: Colors.mutedDark,
    fontSize: 14,
    lineHeight: 21,
    marginTop: -16,
    marginBottom: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.navyAccent,
    fontSize: 17,
    fontWeight: "700",
    flexShrink: 1,
    paddingRight: 12,
  },
  sectionCount: {
    color: Colors.mutedSoft,
    fontSize: 12,
    fontWeight: "500",
  },
  sectionEmpty: {
    color: Colors.mutedSoft,
    fontSize: 13,
    fontStyle: "italic",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    gap: 12,
    shadowColor: Colors.navyDeep,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowText: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    color: Colors.navyAccent,
    fontSize: 15,
    fontWeight: "600",
  },
  rowDescription: {
    color: Colors.mutedDark,
    fontSize: 13,
    lineHeight: 18,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.iceBorder,
  },

  emptyText: {
    color: Colors.mutedDark,
    fontSize: 14,
    textAlign: "center",
    marginTop: 24,
  },
});
