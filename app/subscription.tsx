import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { Colors } from "@/constants/colors";

const FREE_FEATURES = [
  "Accès aux 2 premiers programmes",
  "Communauté de 200 000 Givrés",
  "Newsletter mensuelle",
];

const PREMIUM_FEATURES = [
  "Accès à TOUS les programmes",
  "Nouveaux contenus chaque semaine",
  "Sessions live mensuelles avec Maxime",
  "Calendrier complet des immersions",
  "Suivi de progression avancé",
];

export default function Subscription() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenHeader eyebrow="MON COMPTE" title="Abonnement" />

      {/* Plan actuel */}
      <View style={styles.currentCard}>
        <Text style={styles.currentLabel}>FORMULE ACTUELLE</Text>
        <Text style={styles.currentPlan}>Gratuit</Text>
        <View style={styles.featureList}>
          {FREE_FEATURES.map((f) => (
            <Text key={f} style={styles.featureItem}>
              ✓ {f}
            </Text>
          ))}
        </View>
      </View>

      {/* Plan premium */}
      <View style={styles.premiumCard}>
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumBadgeText}>RECOMMANDÉ</Text>
        </View>

        <Text style={styles.premiumTitle}>Givré Premium</Text>
        <Text style={styles.premiumPrice}>
          9,99 € <Text style={styles.premiumPeriod}>/ mois</Text>
        </Text>

        <View style={styles.featureList}>
          {PREMIUM_FEATURES.map((f) => (
            <Text key={f} style={styles.premiumFeature}>
              ❄ {f}
            </Text>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.upgradeButton,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => {}}
        >
          <Text style={styles.upgradeText}>PASSER PREMIUM</Text>
        </Pressable>

        <Text style={styles.fineprint}>
          Annulable à tout moment · Sans engagement
        </Text>
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

  // Current plan
  currentCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  currentLabel: {
    color: Colors.muted,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "700",
  },
  currentPlan: {
    color: Colors.navyAccent,
    fontSize: 28,
    fontWeight: "300",
    fontStyle: "italic",
    marginTop: 4,
    marginBottom: 16,
  },

  // Premium plan
  premiumCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 22,
    shadowColor: Colors.navyDeep,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  premiumBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.navyAccent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 12,
  },
  premiumBadgeText: {
    color: Colors.snow,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  premiumTitle: {
    color: Colors.navyAccent,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  premiumPrice: {
    color: Colors.navyAccent,
    fontSize: 36,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 4,
  },
  premiumPeriod: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.mutedDark,
  },

  featureList: {
    gap: 8,
    marginTop: 8,
  },
  featureItem: {
    color: Colors.mutedDark,
    fontSize: 13.5,
    lineHeight: 19,
  },
  premiumFeature: {
    color: Colors.navyAccent,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },

  upgradeButton: {
    backgroundColor: Colors.navyAccent,
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 20,
  },
  upgradeText: {
    color: Colors.snow,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2.5,
  },
  fineprint: {
    color: Colors.mutedSoft,
    fontSize: 11,
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
});
