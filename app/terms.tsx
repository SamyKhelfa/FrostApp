import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Colors } from "@/constants/colors";

const SECTIONS = [
  {
    title: "1. Acceptation des conditions",
    body: "En accédant à l'application Frost, vous acceptez d'être lié par les présentes conditions générales d'utilisation. Si vous n'acceptez pas tout ou partie de ces conditions, vous ne devez pas utiliser l'application.",
  },
  {
    title: "2. Description du service",
    body: "Frost propose des contenus pédagogiques autour de l'exposition au froid, de la respiration consciente et du dépassement de soi. Les programmes, vidéos et immersions sont fournis à titre informatif et ne se substituent pas à un avis médical.",
  },
  {
    title: "3. Compte utilisateur",
    body: "Vous êtes responsable de la confidentialité de vos identifiants. Toute activité réalisée depuis votre compte est présumée effectuée par vous. Informez-nous immédiatement de toute utilisation non autorisée.",
  },
  {
    title: "4. Sécurité et santé",
    body: "Les protocoles d'exposition au froid présentent des risques. Avant toute pratique, consultez un médecin. Frost ne saurait être tenu responsable de tout incident lié à une mauvaise utilisation des contenus.",
  },
  {
    title: "5. Propriété intellectuelle",
    body: "L'ensemble des contenus de l'application (textes, vidéos, illustrations, marques) reste la propriété exclusive de Maxime Frost et de ses partenaires. Toute reproduction sans autorisation est interdite.",
  },
  {
    title: "6. Modifications",
    body: "Frost se réserve le droit de modifier les présentes conditions à tout moment. Les modifications prennent effet dès leur publication dans l'application.",
  },
];

export default function Terms() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader eyebrow="LÉGAL" title="Termes et conditions" />

      <Text style={styles.lastUpdate}>Dernière mise à jour : 15 mai 2026</Text>

      <View style={styles.sections}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.footer}>
        Pour toute question, contacte-nous à contact@frost.fr
      </Text>
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
  lastUpdate: {
    color: Colors.ice,
    fontSize: 12,
    fontStyle: "italic",
    opacity: 0.6,
    marginBottom: 24,
  },
  sections: {
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    color: Colors.snow,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  sectionBody: {
    color: Colors.ice,
    fontSize: 13.5,
    lineHeight: 21,
    opacity: 0.85,
  },
  footer: {
    color: Colors.ice,
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 36,
    opacity: 0.6,
  },
});
