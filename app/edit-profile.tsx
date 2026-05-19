import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Colors } from "@/constants/colors";

export default function EditProfile() {
  const [name, setName] = useState("Maxime Frost");
  const [email, setEmail] = useState("maxime@frost.fr");
  const [bio, setBio] = useState("");

  const handleSave = () => {
    console.log({ name, email, bio });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader eyebrow="MON COMPTE" title="Modifier le profil" />

      <View style={styles.form}>
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
          label="Bio"
          value={bio}
          onChangeText={setBio}
          placeholder="Quelques mots sur toi…"
          multiline
        />

        <AuthButton label="ENREGISTRER" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  content: {
    padding: 24,
    paddingTop: 70,
    paddingBottom: 60,
  },
  form: {
    gap: 16,
  },
});
