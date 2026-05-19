import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { Colors } from "@/constants/colors";

type Props = {
  title: string;
  eyebrow?: string;
};

export function ScreenHeader({ title, eyebrow }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={10}
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.titleBlock}>
        {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 28,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    color: Colors.navyAccent,
    fontSize: 24,
    fontWeight: "300",
    marginTop: -3,
  },
  titleBlock: {
    marginTop: 20,
    gap: 4,
  },
  eyebrow: {
    color: Colors.muted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 5,
    opacity: 0.9,
  },
  title: {
    color: Colors.navyAccent,
    fontSize: 30,
    fontWeight: "300",
    fontStyle: "italic",
    marginTop: 4,
  },
});
