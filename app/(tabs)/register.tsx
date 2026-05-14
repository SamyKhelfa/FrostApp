import { useState } from "react";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    console.log({ name, email, password });
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
      <AuthButton label="CRÉER MON COMPTE" onPress={handleRegister} />
    </AuthLayout>
  );
}
