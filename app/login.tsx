import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/core/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Renseigne ton email et ton mot de passe.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch {
      setError("Connexion impossible pour l'instant.");
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <AuthLayout
      eyebrow="CONNEXION"
      title="Bon retour parmi nous"
      footer={{
        mutedText: "Pas encore de compte ?",
        linkText: "S'inscrire",
        href: "/register",
      }}
    >
      <AuthField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="ton@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <AuthField
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <AuthButton
        label={submitting ? "CONNEXION…" : "SE CONNECTER"}
        onPress={handleLogin}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  error: {
    color: Colors.danger,
    fontSize: 13,
    textAlign: "center",
    marginTop: -4,
  },
});
