import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Colors } from "@/constants/colors";
import {
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} from "@/core/api";
import type { INotification } from "@/core/interfaces";

function describe(notification: INotification) {
  const actor = notification.actor?.name ?? "Quelqu'un";
  const room = notification.conversation?.name ?? "une communauté";

  switch (notification.type) {
    case "JOIN_REQUEST":
      return `${actor} demande à rejoindre ${room}.`;
    case "JOIN_APPROVED":
      return `Ta demande pour rejoindre ${room} a été acceptée.`;
    default:
      return "Nouvelle activité.";
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;

  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Notifications() {
  const router = useRouter();
  const { data, isLoading } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationsReadMutation();

  useEffect(() => {
    if ((data?.unreadCount ?? 0) > 0) markRead();
  }, [data?.unreadCount, markRead]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.navyAccent} />
      </SafeAreaView>
    );
  }

  const items = data?.items ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrap}>
        <ScreenHeader eyebrow="ACTIVITÉ" title="Notifications" />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const unread = !item.readAt;
          const conversationId = item.conversation?.id;

          const openTarget = () => {
            if (!conversationId) return;

            if (item.type === "JOIN_REQUEST") {
              router.push({
                pathname: "/conversation/[id]/settings",
                params: { id: conversationId },
              });
              return;
            }

            router.push({
              pathname: "/conversation/[id]",
              params: {
                id: conversationId,
                title: item.conversation?.name ?? "Discussion",
              },
            });
          };

          return (
            <Pressable
              style={({ pressed }) => [
                styles.row,
                unread && styles.rowUnread,
                pressed && styles.pressed,
              ]}
              onPress={openTarget}
              disabled={!conversationId}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.actor ? initialsOf(item.actor.name) : "❄️"}
                </Text>
              </View>

              <View style={styles.body}>
                <Text style={styles.text}>{describe(item)}</Text>
                <Text style={styles.when}>{timeAgo(item.createdAt)}</Text>
              </View>

              {unread && <View style={styles.dot} />}
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyText}>
              Rien de neuf pour l&apos;instant.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
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

  headerWrap: { paddingHorizontal: 24, paddingTop: 8 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    marginBottom: 8,
  },
  rowUnread: { backgroundColor: Colors.iceLight },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.ice,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.navyAccent,
    fontSize: 14,
    fontWeight: "700",
  },
  body: { flex: 1, gap: 3 },
  text: {
    color: Colors.navyAccent,
    fontSize: 14,
    lineHeight: 20,
  },
  when: { color: Colors.mutedSoft, fontSize: 11 },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.danger,
  },

  empty: { alignItems: "center", paddingTop: 60, gap: 10 },
  emptyEmoji: { fontSize: 40 },
  emptyText: {
    color: Colors.mutedSoft,
    fontSize: 14,
    fontStyle: "italic",
  },
});
