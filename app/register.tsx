import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/core/context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async () => {
    setError(null);
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Tous les champs sont requis.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères.");
      return;
    }
    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e: any) {
      const status = e?.status ?? e?.data?.statusCode;
      const msg = e?.data?.message;

      if (status === 409) {
        // Backend renvoie 409 quand l'email est déjà utilisé
        setError("Un compte existe déjà avec cet email.");
      } else if (status === "FETCH_ERROR") {
        setError("Impossible de joindre le serveur. Vérifie ta connexion.");
      } else if (status === 400) {
        // Erreurs de validation class-validator (msg est un tableau)
        if (Array.isArray(msg)) {
          // Traduction rapide des erreurs les plus fréquentes
          if (msg.some((m: string) => m.includes("email"))) {
            setError("L'email n'est pas valide.");
          } else if (msg.some((m: string) => m.includes("password"))) {
            setError("Mot de passe trop court (min 6 caractères).");
          } else if (msg.some((m: string) => m.includes("name"))) {
            setError("Le nom doit faire au moins 2 caractères.");
          } else {
            setError("Données invalides.");
          }
        } else {
          setError("Données invalides.");
        }
      } else {
        setError("Création du compte impossible pour l'instant.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="INSCRIPTION"
      title="Rejoins les Givrés"
      footer={{
        mutedText: "Déjà un compte ?",
        linkText: "Se connecter",
        href: "/login",
      }}
    >
      <AuthField
        label="Nom"
        value={name}
        onChangeText={setName}
        placeholder="Ton prénom"
        autoCapitalize="words"
      />
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
        label={submitting ? "CRÉATION…" : "CRÉER MON COMPTE"}
        onPress={handleRegister}
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
