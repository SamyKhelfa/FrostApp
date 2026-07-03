import { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Colors } from "@/constants/colors";
import { useForgotPasswordMutation } from "@/core/api";

export default function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim()) {
      setError("Renseigne ton email.");
      return;
    }

    try {
      await forgotPassword({ email: email.trim() }).unwrap();
      setSubmitted(true);
    } catch (e: any) {
      const status = e?.status ?? e?.data?.statusCode;

      if (status === "FETCH_ERROR") {
        setError("Impossible de joindre le serveur. Vérifie ta connexion.");
      } else if (status === 400) {
        setError("Format d'email invalide.");
      } else {
        // On garde le message générique — pas de révélation
        setSubmitted(true);
      }
    }
  };

  if (submitted) {
    return (
      <AuthLayout
        eyebrow="MOT DE PASSE OUBLIÉ"
        title="Vérifie tes mails"
        footer={{
          mutedText: "Tu t'en souviens ?",
          linkText: "Se connecter",
          href: "/login",
        }}
      >
        <Text style={styles.successBig}>✉️</Text>
        <Text style={styles.successMessage}>
          Si un compte existe avec cet email, tu recevras un lien de
          réinitialisation dans quelques instants.
        </Text>
        <Text style={styles.hint}>
          Pense à vérifier tes spams.
        </Text>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="MOT DE PASSE OUBLIÉ"
      title="Récupère ton accès"
      footer={{
        mutedText: "Tu t'en souviens ?",
        linkText: "Se connecter",
        href: "/login",
      }}
    >
      <Text style={styles.intro}>
        Renseigne l&apos;adresse mail associée à ton compte. Nous t&apos;enverrons
        un lien pour réinitialiser ton mot de passe.
      </Text>

      <AuthField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="ton@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <AuthButton
        label={isLoading ? "ENVOI…" : "ENVOYER LE LIEN"}
        onPress={handleSubmit}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  intro: {
    color: Colors.mutedDark,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 8,
  },
  error: {
    color: Colors.danger,
    fontSize: 13,
    textAlign: "center",
    marginTop: -4,
  },
  successBig: {
    fontSize: 48,
    textAlign: "center",
    marginBottom: 8,
  },
  successMessage: {
    color: Colors.navyAccent,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    fontWeight: "500",
  },
  hint: {
    color: Colors.mutedDark,
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
});
