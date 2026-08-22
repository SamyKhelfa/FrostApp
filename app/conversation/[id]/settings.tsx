import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useCallback } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Colors } from "@/constants/colors";
import {
  useGetConversationDetailsQuery,
  useGetJoinRequestsQuery,
  useLeaveCommunityMutation,
  useReviewJoinRequestMutation,
  useSetConversationMutedMutation,
} from "@/core/api";
import type { IConversationMember, ParticipantRole } from "@/core/interfaces";

const ROLE_LABEL: Record<ParticipantRole, string> = {
  OWNER: "Créateur",
  ADMIN: "Admin",
  MEMBER: "",
};

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Avatar({ name }: { name: string }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initialsOf(name)}</Text>
    </View>
  );
}

function MemberRow({ member }: { member: IConversationMember }) {
  const badge = ROLE_LABEL[member.role];

  return (
    <View style={styles.memberRow}>
      <Avatar name={member.user.name} />
      <Text style={styles.memberName} numberOfLines={1}>
        {member.user.name}
      </Text>
      {!!badge && <Text style={styles.roleBadge}>{badge}</Text>}
    </View>
  );
}

export default function ConversationSettings() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const conversationId = Number(id);

  const {
    data: details,
    isLoading,
    refetch,
  } = useGetConversationDetailsQuery(conversationId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const isAdmin = details?.me.isAdmin ?? false;

  const { data: requests } = useGetJoinRequestsQuery(conversationId, {
    skip: !isAdmin,
  });

  const [setMuted, { isLoading: isMuting }] = useSetConversationMutedMutation();
  const [reviewRequest, { originalArgs: reviewArgs, isLoading: isReviewing }] =
    useReviewJoinRequestMutation();
  const [leaveCommunity, { isLoading: isLeaving }] = useLeaveCommunityMutation();

  const handleMute = async (muted: boolean) => {
    try {
      await setMuted({ conversationId, muted }).unwrap();
    } catch {
      Alert.alert("Action impossible", "Réessaie dans un instant.");
    }
  };

  const handleReview = async (userId: number, approve: boolean) => {
    try {
      await reviewRequest({ conversationId, userId, approve }).unwrap();
    } catch {
      Alert.alert("Action impossible", "Réessaie dans un instant.");
    }
  };

  const confirmLeave = () => {
    Alert.alert(
      "Quitter la communauté",
      "Tu ne recevras plus ses messages. Tu pourras la rejoindre à nouveau plus tard.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Quitter",
          style: "destructive",
          onPress: async () => {
            try {
              await leaveCommunity(conversationId).unwrap();
              router.replace("/(tabs)/chat");
            } catch (e: any) {
              Alert.alert(
                "Impossible de quitter",
                e?.data?.message ?? "Réessaie dans un instant.",
              );
            }
          },
        },
      ],
    );
  };

  if (isLoading || !details) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.navyAccent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow="PARAMÈTRES" title={details.name ?? "Discussion"} />

        <View style={styles.identity}>
          <View style={styles.bigAvatar}>
            <Text style={styles.bigAvatarText}>
              {initialsOf(details.name ?? "?")}
            </Text>
          </View>
          {!!details.description && (
            <Text style={styles.description}>{details.description}</Text>
          )}
          <Text style={styles.meta}>
            {details.memberCount}{" "}
            {details.memberCount > 1 ? "membres" : "membre"}
            {details.joinPolicy === "APPROVAL" ? " · sur validation" : " · ouverte"}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Silencieux</Text>
              <Text style={styles.settingHint}>
                Les notifications push arrivent bientôt : ce réglage sera
                appliqué dès qu&apos;elles seront en place.
              </Text>
            </View>
            <Switch
              value={details.me.muted}
              onValueChange={handleMute}
              disabled={isMuting}
            />
          </View>
        </View>

        {isAdmin && (requests?.length ?? 0) > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Demandes en attente ({requests?.length})
            </Text>
            <View style={styles.card}>
              {requests?.map((request) => {
                const busy =
                  isReviewing && reviewArgs?.userId === request.userId;

                return (
                  <View key={request.id} style={styles.requestRow}>
                    <Avatar name={request.user.name} />
                    <Text style={styles.memberName} numberOfLines={1}>
                      {request.user.name}
                    </Text>

                    {busy ? (
                      <ActivityIndicator size="small" color={Colors.muted} />
                    ) : (
                      <View style={styles.requestActions}>
                        <Pressable
                          style={({ pressed }) => [
                            styles.reject,
                            pressed && styles.pressed,
                          ]}
                          onPress={() => handleReview(request.userId, false)}
                          hitSlop={6}
                        >
                          <Text style={styles.rejectText}>Refuser</Text>
                        </Pressable>
                        <Pressable
                          style={({ pressed }) => [
                            styles.approve,
                            pressed && styles.pressed,
                          ]}
                          onPress={() => handleReview(request.userId, true)}
                          hitSlop={6}
                        >
                          <Text style={styles.approveText}>Accepter</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Membres</Text>
        <View style={styles.card}>
          {details.members.map((member) => (
            <MemberRow key={member.userId} member={member} />
          ))}
        </View>

        {!details.me.isOwner && (
          <Pressable
            style={({ pressed }) => [styles.leave, pressed && styles.pressed]}
            onPress={confirmLeave}
            disabled={isLeaving}
          >
            {isLeaving ? (
              <ActivityIndicator color={Colors.danger} />
            ) : (
              <Text style={styles.leaveText}>Quitter la communauté</Text>
            )}
          </Pressable>
        )}

        {details.me.isOwner && (
          <Text style={styles.ownerNote}>
            Tu as créé cette communauté. Un créateur ne peut pas la quitter.
          </Text>
        )}
      </ScrollView>
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
  content: { padding: 24, paddingBottom: 48 },
  pressed: { opacity: 0.7 },

  identity: { alignItems: "center", marginTop: -8, marginBottom: 8 },
  bigAvatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.ice,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  bigAvatarText: {
    color: Colors.navyAccent,
    fontSize: 28,
    fontWeight: "700",
  },
  description: {
    color: Colors.mutedDark,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  meta: {
    color: Colors.mutedSoft,
    fontSize: 12,
    marginTop: 8,
  },

  sectionTitle: {
    color: Colors.mutedSoft,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 26,
    marginBottom: 8,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginTop: 18,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 14,
  },
  settingText: { flex: 1 },
  settingLabel: {
    color: Colors.navyAccent,
    fontSize: 15,
    fontWeight: "600",
  },
  settingHint: {
    color: Colors.mutedSoft,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.iceLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.navyAccent,
    fontSize: 13,
    fontWeight: "700",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
  },
  memberName: {
    flex: 1,
    color: Colors.navyAccent,
    fontSize: 15,
  },
  roleBadge: {
    color: Colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  requestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
  },
  requestActions: { flexDirection: "row", gap: 8 },
  reject: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  rejectText: { color: Colors.mutedDark, fontSize: 12, fontWeight: "600" },
  approve: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: Colors.navyAccent,
  },
  approveText: { color: Colors.snow, fontSize: 12, fontWeight: "700" },

  leave: {
    marginTop: 28,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dangerLight,
    alignItems: "center",
    minHeight: 50,
    justifyContent: "center",
  },
  leaveText: { color: Colors.danger, fontSize: 15, fontWeight: "700" },
  ownerNote: {
    color: Colors.mutedSoft,
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 28,
  },
});
