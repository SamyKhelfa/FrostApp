import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Colors } from "@/constants/colors";

const SECTIONS = [
  {
    title: "1. Données collectées",
    body: "Lors de la création de ton compte, nous collectons : ton nom, ton email et un mot de passe chiffré. Nous enregistrons également ta progression dans les programmes pour te permettre de reprendre où tu t'es arrêté.",
  },
  {
    title: "2. Utilisation de tes données",
    body: "Tes données servent exclusivement à : te permettre d'accéder à ton compte, suivre ta progression, te communiquer des informations sur tes programmes, et améliorer l'expérience de l'application.",
  },
  {
    title: "3. Partage avec des tiers",
    body: "Nous ne vendons ni ne louons jamais tes données. Nos seuls partenaires techniques sont des prestataires d'hébergement et d'analyse qui respectent le RGPD.",
  },
  {
    title: "4. Sécurité",
    body: "Tes mots de passe sont chiffrés et stockés sur des serveurs sécurisés. Les communications avec l'application sont protégées par HTTPS.",
  },
  {
    title: "5. Tes droits",
    body: "Conformément au RGPD, tu disposes d'un droit d'accès, de rectification, de suppression et de portabilité de tes données. Pour exercer ces droits, contacte-nous à privacy@frost.fr.",
  },
  {
    title: "6. Cookies et tracking",
    body: "L'application utilise un nombre minimal d'identifiants techniques nécessaires à son bon fonctionnement. Aucun cookie publicitaire n'est utilisé.",
  },
  {
    title: "7. Suppression de compte",
    body: "Tu peux à tout moment demander la suppression définitive de ton compte depuis la page Profil. Tes données seront alors effacées sous 30 jours.",
  },
];

export default function Privacy() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader eyebrow="LÉGAL" title="Confidentialité" />

      <Text style={styles.lastUpdate}>Dernière mise à jour : 15 mai 2026</Text>

      <Text style={styles.intro}>
        Ta vie privée est essentielle. Voici, en toute transparence, comment
        Frost gère tes données.
      </Text>

      <View style={styles.sections}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        Une question ? Écris-nous à privacy@frost.fr
      </Text>
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
  lastUpdate: {
    color: Colors.mutedSoft,
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 16,
  },
  intro: {
    color: Colors.navyAccent,
    fontSize: 14,
    lineHeight: 21,
    fontStyle: "italic",
    marginBottom: 28,
  },
  sections: {
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: Colors.navyAccent,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  sectionBody: {
    color: Colors.mutedDark,
    fontSize: 13.5,
    lineHeight: 21,
  },
  footer: {
    color: Colors.mutedSoft,
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 36,
  },
});
