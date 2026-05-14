import { useState } from "react";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log({ email, password });
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
      <AuthButton label="SE CONNECTER" onPress={handleLogin} />
    </AuthLayout>
  );
}
