import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenHeader } from "@/components/ui/ScreenHeader";

import { Colors } from "@/constants/colors";
import { useAuth } from "@/core/context/AuthContext";
import {
  useGetConversationDetailsQuery,
  useGetMessagesQuery,
  useMarkConversationReadMutation,
  useSendMessageMutation,
} from "@/core/api";
import type { IMessage } from "@/core/interfaces";

const POLL_INTERVAL = 3000;

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({
  message,
  isMine,
  showAuthor,
}: {
  message: IMessage;
  isMine: boolean;
  showAuthor: boolean;
}) {
  return (
    <View style={[styles.bubbleRow, isMine && styles.bubbleRowMine]}>
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
        {!isMine && showAuthor && (
          <Text style={styles.author}>{message.author?.name ?? "Anonyme"}</Text>
        )}
        <Text style={[styles.content, isMine && styles.contentMine]}>
          {message.content}
        </Text>
        <Text style={[styles.time, isMine && styles.timeMine]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

export default function ConversationThread() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const router = useRouter();
  const [draft, setDraft] = useState("");

  const conversationId = Number(id);

  const { data: messages, isLoading: isLoadingMessages } = useGetMessagesQuery(
    { conversationId },
    { skip: !conversationId, pollingInterval: POLL_INTERVAL },
  );

  const { data: details } = useGetConversationDetailsQuery(conversationId, {
    skip: !conversationId,
  });

  const pendingCount = details?.pendingCount ?? 0;

  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [markRead] = useMarkConversationReadMutation();

  useEffect(() => {
    if (conversationId) markRead(conversationId);
  }, [conversationId, messages?.length, markRead]);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !conversationId) return;

    setDraft("");

    try {
      await sendMessage({ conversationId, content }).unwrap();
    } catch {
      setDraft(content);
    }
  };

  if (isLoadingMessages) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.navyAccent} />
      </View>
    );
  }

  const ordered = [...(messages ?? [])].reverse();
  const bottomPad = Math.max(insets.bottom, 14);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <ScreenHeader eyebrow="COMMUNAUTÉ" title={title ?? "Discussion"} />

        <Pressable
          style={({ pressed }) => [styles.settings, pressed && styles.pressed]}
          onPress={() =>
            router.push({
              pathname: "/conversation/[id]/settings",
              params: { id: conversationId },
            })
          }
          hitSlop={10}
        >
          <Text style={styles.settingsIcon}>⋯</Text>
          {pendingCount > 0 && (
            <View style={styles.settingsBadge}>
              <Text style={styles.settingsBadgeText}>{pendingCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <FlatList
        data={ordered}
        inverted
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[styles.list, { paddingBottom: 16 }]}
        keyboardDismissMode="interactive"
        renderItem={({ item, index }) => {
          const next = ordered[index + 1];
          return (
            <MessageBubble
              message={item}
              isMine={item.authorId === user?.id}
              showAuthor={!next || next.authorId !== item.authorId}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Personne n&apos;a encore écrit. Lance la discussion.
            </Text>
          </View>
        }
      />

      <View style={[styles.composer, { paddingBottom: bottomPad }]}>
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          placeholder="Écrire un message…"
          placeholderTextColor={Colors.mutedSoft}
          multiline
          maxLength={2000}
        />
        <Pressable
          style={({ pressed }) => [
            styles.send,
            (!draft.trim() || isSending) && styles.sendDisabled,
            pressed && styles.sendPressed,
          ]}
          onPress={handleSend}
          disabled={!draft.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color={Colors.snow} />
          ) : (
            <Text style={styles.sendIcon}>↑</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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

  settings: {
    position: "absolute",
    right: 24,
    bottom: 18,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surface,
  },
  settingsBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    backgroundColor: Colors.danger,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.appBg,
  },
  settingsBadgeText: {
    color: Colors.snow,
    fontSize: 10,
    fontWeight: "800",
  },
  settingsIcon: {
    color: Colors.navyAccent,
    fontSize: 22,
    fontWeight: "700",
    marginTop: -8,
  },
  pressed: { opacity: 0.7 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.appBg,
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

  list: { paddingHorizontal: 16, paddingTop: 12 },

  bubbleRow: { flexDirection: "row", marginBottom: 8 },
  bubbleRowMine: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "78%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleTheirs: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  bubbleMine: {
    backgroundColor: Colors.navyAccent,
    borderBottomRightRadius: 4,
  },
  author: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 3,
  },
  content: { color: Colors.navyAccent, fontSize: 15, lineHeight: 21 },
  contentMine: { color: Colors.snow },
  time: {
    color: Colors.mutedSoft,
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  timeMine: { color: Colors.ice },

  empty: {
    alignItems: "center",
    paddingVertical: 40,
    transform: [{ scaleY: -1 }],
  },
  emptyText: {
    color: Colors.mutedSoft,
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
  },

  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 42,
    borderRadius: 21,
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
    backgroundColor: Colors.iceLight,
    color: Colors.navyAccent,
    fontSize: 15,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.navyAccent,
  },
  sendDisabled: { opacity: 0.4 },
  sendPressed: { opacity: 0.75 },
  sendIcon: {
    color: Colors.snow,
    fontSize: 20,
    fontWeight: "700",
    marginTop: -2,
  },
});
