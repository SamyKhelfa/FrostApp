import { Pressable, StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/colors";

type Props = {
  label: string;
  onPress: () => void;
};

export function AuthButton({ label, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cta,
        pressed && styles.ctaPressed,
      ]}
    >
      <Text style={styles.ctaText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cta: {
    backgroundColor: Colors.snow,
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  ctaText: {
    color: Colors.navyAccent,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2.5,
  },
});
