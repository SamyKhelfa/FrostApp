import { useState } from "react";
import { ScrollView, StyleSheet, View,Text } from "react-native";
import {router} from "expo-router";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Colors } from "@/constants/colors";
import {useAuth} from "@/core/context/AuthContext";
import {useUpdateMeMutation} from "@/core/api";

export default function EditProfile() {
  const { user } = useAuth();
  const [updateMe, {isLoading}] = useUpdateMeMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false);
  const [bio, setBio] = useState("");

  const handleSave = async () => {
    setError(null);
    setSuccess(false);

    const payload: { name?: string; email?: string } = {};
    if (name.trim()) payload.name = name.trim();
    if (email.trim()) payload.email = email.trim();

    if (Object.keys(payload).length === 0) {
      setError("Renseigne au moins un champ à modifier.");
      return;
    }

    try {
      await updateMe(payload).unwrap();
      setSuccess(true);
      setTimeout(() => router.back(), 1000);
      setName("");
      setEmail("");
    } catch (e: any) {
      const msg = e?.data?.message;
      setError(
          Array.isArray(msg) ? msg.join("\n") : msg || "Impossible d'enregistrer.",
      );
    }
  };


  return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ScreenHeader eyebrow="MON COMPTE" title="Modifier le profil" />

        <View style={styles.form}>
          <AuthField
              label="Nom"
              value={name}
              onChangeText={setName}
              placeholder={user?.name || "Ton nom"}
              autoCapitalize="words"
          />
          <AuthField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder={user?.email || "ton@email.com"}
              keyboardType="email-address"
              autoCapitalize="none"
          />

          {error && <Text style={styles.error}>{error}</Text>}
          {success && <Text style={styles.success}>✅ Profil mis à jour</Text>}

          <AuthButton
              label={isLoading ? "ENREGISTREMENT…" : "ENREGISTRER"}
              onPress={handleSave}
          />
        </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.appBg,
  },
  content: {
    padding: 24,
    paddingTop: 70,
    paddingBottom: 60,
  },
  form: {
    gap: 16,
  },
  error: { color: Colors.danger, fontSize: 13, textAlign: "center" },
  success: { color: "#16A34A", fontSize: 13, textAlign: "center" },
});
