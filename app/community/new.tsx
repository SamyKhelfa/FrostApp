import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Colors } from "@/constants/colors";
import { useCreateCommunityMutation } from "@/core/api";
import type { JoinPolicy } from "@/core/interfaces";

const POLICIES: { value: JoinPolicy; label: string; hint: string }[] = [
  {
    value: "OPEN",
    label: "Ouverte",
    hint: "N'importe qui peut rejoindre immédiatement.",
  },
  {
    value: "APPROVAL",
    label: "Sur validation",
    hint: "Un administrateur doit accepter chaque demande.",
  },
];

export default function NewCommunity() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [joinPolicy, setJoinPolicy] = useState<JoinPolicy>("OPEN");

  const [createCommunity, { isLoading }] = useCreateCommunityMutation();

  const handleCreate = async () => {
    const trimmed = name.trim();

    if (trimmed.length < 3) {
      Alert.alert("Nom trop court", "Choisis un nom d'au moins 3 caractères.");
      return;
    }

    try {
      const community = await createCommunity({
        name: trimmed,
        description: description.trim() || undefined,
        joinPolicy,
      }).unwrap();

      router.replace({
        pathname: "/conversation/[id]",
        params: { id: community.id, title: trimmed },
      });
    } catch (e: any) {
      Alert.alert(
        "Création impossible",
        e?.data?.message ?? "Réessaie dans un instant.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow="COMMUNAUTÉ" title="Nouvelle communauté" />

        <Text style={styles.label}>Nom</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Défi 30 jours"
          placeholderTextColor={Colors.mutedSoft}
          maxLength={60}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={description}
          onChangeText={setDescription}
          placeholder="De quoi parle-t-on ici ?"
          placeholderTextColor={Colors.mutedSoft}
          multiline
          maxLength={300}
        />

        <Text style={styles.label}>Qui peut entrer ?</Text>
        {POLICIES.map((policy) => {
          const selected = joinPolicy === policy.value;
          return (
            <Pressable
              key={policy.value}
              style={({ pressed }) => [
                styles.policy,
                selected && styles.policySelected,
                pressed && styles.pressed,
              ]}
              onPress={() => setJoinPolicy(policy.value)}
            >
              <View style={[styles.radio, selected && styles.radioOn]}>
                {selected && <View style={styles.radioDot} />}
              </View>
              <View style={styles.policyText}>
                <Text style={styles.policyLabel}>{policy.label}</Text>
                <Text style={styles.policyHint}>{policy.hint}</Text>
              </View>
            </Pressable>
          );
        })}

        <Pressable
          style={({ pressed }) => [
            styles.submit,
            isLoading && styles.submitDisabled,
            pressed && styles.pressed,
          ]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.snow} />
          ) : (
            <Text style={styles.submitText}>CRÉER LA COMMUNAUTÉ</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.appBg },
  content: { padding: 24, paddingBottom: 48 },
  pressed: { opacity: 0.75 },

  label: {
    color: Colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 22,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: Colors.navyAccent,
    fontSize: 15,
  },
  textarea: { minHeight: 90, textAlignVertical: "top" },

  policy: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 14,
    marginBottom: 10,
  },
  policySelected: { borderColor: Colors.navyAccent },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.iceBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOn: { borderColor: Colors.navyAccent },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.navyAccent,
  },
  policyText: { flex: 1 },
  policyLabel: {
    color: Colors.navyAccent,
    fontSize: 15,
    fontWeight: "600",
  },
  policyHint: {
    color: Colors.mutedDark,
    fontSize: 12,
    marginTop: 2,
  },

  submit: {
    marginTop: 28,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.navyAccent,
    alignItems: "center",
    minHeight: 54,
    justifyContent: "center",
  },
  submitDisabled: { opacity: 0.5 },
  submitText: {
    color: Colors.snow,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
