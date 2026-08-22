import {
  ActivityIndicator,
  Alert,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Colors } from "@/constants/colors";
import {
  useGetCommunitiesQuery,
  useJoinCommunityMutation,
} from "@/core/api";
import type { ICommunitySummary } from "@/core/interfaces";

const FLOATING_TAB_BAR_PAD = 96;
const POLL_INTERVAL = 15000;

function initialsOf(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatWhen(iso: string | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  return sameDay
    ? date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

function CommunityRow({
  community,
  onPress,
  onJoin,
  joining,
}: {
  community: ICommunitySummary;
  onPress: () => void;
  onJoin: () => void;
  joining: boolean;
}) {
  const isMember = community.membership === "ACTIVE";
  const isPending = community.membership === "PENDING";

  const preview = community.lastMessage
    ? `${community.lastMessage.author?.name ?? ""}: ${community.lastMessage.content}`
    : community.description || "Aucun message";

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={isMember ? onPress : undefined}
      disabled={!isMember && !isPending && joining}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initialsOf(community.name)}</Text>
      </View>

      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {community.name ?? "Sans nom"}
          </Text>
          {community.pendingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{community.pendingCount}</Text>
            </View>
          )}
          {isMember && (
            <Text style={styles.rowWhen}>
              {formatWhen(community.lastMessage?.createdAt)}
            </Text>
          )}
        </View>

        <View style={styles.rowBottom}>
          <Text style={styles.rowPreview} numberOfLines={1}>
            {preview}
          </Text>

          {isPending && <Text style={styles.pendingTag}>En attente</Text>}

          {!isMember && !isPending && (
            <Pressable
              style={({ pressed }) => [
                styles.joinButton,
                pressed && styles.rowPressed,
              ]}
              onPress={onJoin}
              disabled={joining}
              hitSlop={8}
            >
              {joining ? (
                <ActivityIndicator size="small" color={Colors.snow} />
              ) : (
                <Text style={styles.joinLabel}>
                  {community.joinPolicy === "OPEN" ? "Rejoindre" : "Demander"}
                </Text>
              )}
            </Pressable>
          )}
        </View>

        {community.pendingCount > 0 && (
          <Text style={styles.pendingHint}>
            {community.pendingCount}{" "}
            {community.pendingCount > 1
              ? "demandes à traiter"
              : "demande à traiter"}
          </Text>
        )}

        <Text style={styles.memberCount}>
          {community.memberCount}{" "}
          {community.memberCount > 1 ? "membres" : "membre"}
          {community.joinPolicy === "APPROVAL" ? " · sur validation" : ""}
        </Text>
      </View>
    </Pressable>
  );
}

export default function CommunitiesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    data: communities,
    isLoading,
    refetch,
  } = useGetCommunitiesQuery(undefined, { pollingInterval: POLL_INTERVAL });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );
  const [joinCommunity, { isLoading: isJoining, originalArgs }] =
    useJoinCommunityMutation();

  const handleJoin = async (community: ICommunitySummary) => {
    try {
      const result = await joinCommunity(community.id).unwrap();

      if (result.status === "PENDING") {
        Alert.alert(
          "Demande envoyée",
          "Un administrateur doit valider ton entrée dans cette communauté.",
        );
      }
    } catch {
      Alert.alert("Impossible de rejoindre", "Réessaie dans un instant.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.navyAccent} />
      </View>
    );
  }

  const all = communities ?? [];
  const mine = all.filter((c) => c.membership === "ACTIVE");
  const others = all.filter((c) => c.membership !== "ACTIVE");

  const sections = [
    ...(mine.length ? [{ title: "Mes communautés", data: mine }] : []),
    ...(others.length ? [{ title: "À découvrir", data: others }] : []),
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={styles.eyebrow}>COMMUNAUTÉ</Text>
          <Text style={styles.title}>Messages</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.newButton, pressed && styles.rowPressed]}
          onPress={() => router.push("/community/new")}
          hitSlop={8}
        >
          <Text style={styles.newButtonIcon}>+</Text>
        </Pressable>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: FLOATING_TAB_BAR_PAD + Math.max(insets.bottom, 14) },
        ]}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionTitle}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <CommunityRow
            community={item}
            joining={isJoining && originalArgs === item.id}
            onJoin={() => handleJoin(item)}
            onPress={() =>
              router.push({
                pathname: "/conversation/[id]",
                params: { id: item.id, title: item.name ?? "Discussion" },
              })
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucune communauté pour l&apos;instant. Crée la première.
          </Text>
        }
      />
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

  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  eyebrow: {
    color: Colors.muted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 4,
  },
  title: {
    color: Colors.navyAccent,
    fontSize: 26,
    fontWeight: "300",
    fontStyle: "italic",
    marginTop: 4,
  },
  newButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.navyAccent,
  },
  newButtonIcon: {
    color: Colors.snow,
    fontSize: 24,
    fontWeight: "300",
    marginTop: -3,
  },

  list: { paddingHorizontal: 16, paddingTop: 8 },
  sectionTitle: {
    color: Colors.mutedSoft,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    marginBottom: 8,
  },
  rowPressed: { opacity: 0.72 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.ice,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.navyAccent,
    fontSize: 17,
    fontWeight: "700",
  },
  rowBody: { flex: 1, gap: 2 },
  rowTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowTitle: {
    flex: 1,
    color: Colors.navyAccent,
    fontSize: 16,
    fontWeight: "700",
  },
  rowWhen: { color: Colors.mutedDate, fontSize: 11 },
  rowBottom: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowPreview: { flex: 1, color: Colors.mutedDark, fontSize: 13 },
  memberCount: { color: Colors.mutedSoft, fontSize: 11 },

  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: Colors.snow,
    fontSize: 11,
    fontWeight: "800",
  },
  pendingHint: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: "600",
  },
  pendingTag: {
    color: Colors.muted,
    fontSize: 11,
    fontStyle: "italic",
  },
  joinButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.navyAccent,
    minWidth: 84,
    alignItems: "center",
  },
  joinLabel: {
    color: Colors.snow,
    fontSize: 12,
    fontWeight: "700",
  },

  emptyText: {
    color: Colors.mutedSoft,
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 40,
  },
});
