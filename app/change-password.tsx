import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Colors } from "@/constants/colors";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit faire au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    console.log({ currentPassword, newPassword });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader eyebrow="SÉCURITÉ" title="Mot de passe" />

      <Text style={styles.intro}>
        Pour ta sécurité, choisis un mot de passe d&apos;au moins 8 caractères
        avec un mélange de lettres et chiffres.
      </Text>

      <View style={styles.form}>
        <AuthField
          label="Mot de passe actuel"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="••••••••"
          secureTextEntry
        />
        <AuthField
          label="Nouveau mot de passe"
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="••••••••"
          secureTextEntry
        />
        <AuthField
          label="Confirmer le nouveau"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <AuthButton label="METTRE À JOUR" onPress={handleSubmit} />
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
  intro: {
    color: Colors.mutedDark,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 24,
    fontStyle: "italic",
  },
  form: {
    gap: 16,
  },
  error: {
    color: Colors.dangerLight,
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
});
