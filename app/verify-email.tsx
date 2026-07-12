import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { Colors } from "@/constants/colors";
import { useVerifyEmailMutation } from "@/core/api";

export default function VerifyEmail() {
    const { token } = useLocalSearchParams<{ token?: string }>();
    const [verifyEmail] = useVerifyEmailMutation();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setErrorMessage("Le lien est incomplet.");
            return;
        }

        (async () => {
            try {
                await verifyEmail({ token }).unwrap();
                setStatus("success");
            } catch (e: any) {
                const message = e?.data?.message;
                setStatus("error");
                setErrorMessage(
                    typeof message === "string"
                        ? message
                        : "Une erreur est survenue. Réessaie plus tard."
                );
            }
        })();
    }, [token, verifyEmail]);

    if (status === "loading") {
        return (
            <AuthLayout
                eyebrow="VÉRIFICATION EN COURS"
                title="On vérifie ton email…"
            >
                <View style={styles.loaderWrap}>
                    <ActivityIndicator size="large" color={Colors.navyAccent} />
                </View>
            </AuthLayout>
        );
    }

    if (status === "success") {
        return (
            <AuthLayout
                eyebrow="EMAIL VÉRIFIÉ"
                title="C'est tout bon"
                footer={{
                    mutedText: "Prêt à plonger ?",
                    linkText: "Accéder à l'app",
                    href: "/(tabs)",
                }}
            >
                <Text style={styles.successBig}>✅</Text>
                <Text style={styles.successMessage}>
                    Ton adresse mail est maintenant vérifiée. Bienvenue chez Frost.
                </Text>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            eyebrow="LIEN INVALIDE"
            title="Ce lien ne fonctionne pas"
            footer={{
                mutedText: "Besoin d'un nouveau lien ?",
                linkText: "Retour à l'app",
                href: "/(tabs)",
            }}
        >
            <Text style={styles.error}>
                {errorMessage ?? "Une erreur est survenue."}
            </Text>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    loaderWrap: {
        alignItems: "center",
        paddingVertical: 32,
    },
    error: {
        color: Colors.danger,
        fontSize: 13,
        textAlign: "center",
        marginTop: -4,
    },
    successBig: {
        fontSize: 48,
        textAlign: "center",
        marginBottom: 8,
    },
    successMessage: {
        color: Colors.navyAccent,
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
        fontWeight: "500",
    },
});