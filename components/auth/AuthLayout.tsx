import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { Colors } from "@/constants/colors";

type Props = {
  eyebrow: string;
  title: string;
  children: ReactNode;
  footer: {
    mutedText: string;
    linkText: string;
    href: string;
  };
};

export function AuthLayout({ eyebrow, title, children, footer }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>FROST</Text>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.form}>{children}</View>

        <Pressable
          onPress={() => router.push(footer.href as never)}
          style={styles.footerLink}
          hitSlop={10}
        >
          <Text style={styles.footerLinkMuted}>{footer.mutedText} </Text>
          <Text style={styles.footerLinkAccent}>{footer.linkText}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.appBg,
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    gap: 32,
  },

  header: {
    alignItems: "center",
    gap: 6,
  },
  logo: {
    color: Colors.navyAccent,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 8,
    marginBottom: 12,
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
    fontSize: 26,
    fontWeight: "300",
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
  },

  form: {
    gap: 16,
  },

  footerLink: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerLinkMuted: {
    color: Colors.mutedDark,
    fontSize: 14,
  },
  footerLinkAccent: {
    color: Colors.navyAccent,
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
