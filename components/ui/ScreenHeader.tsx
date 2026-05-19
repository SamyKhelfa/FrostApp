import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { Alpha, Colors } from "@/constants/colors";

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
    borderColor: Alpha.iceBorder25,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    color: Colors.snow,
    fontSize: 24,
    fontWeight: "300",
    marginTop: -3,
  },
  titleBlock: {
    marginTop: 20,
    gap: 4,
  },
  eyebrow: {
    color: Colors.ice,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 5,
    opacity: 0.7,
  },
  title: {
    color: Colors.snow,
    fontSize: 30,
    fontWeight: "300",
    fontStyle: "italic",
    marginTop: 4,
  },
});
