import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { AuthButton } from "@/components/auth/AuthButton";
import { AuthField } from "@/components/auth/AuthField";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Colors } from "@/constants/colors";
import { useResetPasswordMutation } from "@/core/api";

export default function ResetPassword() {
    const { token } = useLocalSearchParams<{ token?: string }>();

    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!token) {
        return (
            <AuthLayout
                eyebrow="LIEN INVALIDE"
                title="Ce lien ne fonctionne pas"
                footer={{
                    mutedText: "Besoin d'un nouveau lien ?",
                    linkText: "Demander à nouveau",
                    href: "/forgot-password",
                }}
            >
                <Text style={styles.error}>
                    Le lien est incomplet. Demande un nouveau mail de réinitialisation.
                </Text>
            </AuthLayout>
        );
    }

    const handleSubmit = async () => {
        setError(null);

        // Validation client
        if (newPassword.length < 8) {
            setError("Le mot de passe doit faire au moins 8 caractères.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            await resetPassword({ token, newPassword }).unwrap();
            setSuccess(true);
        } catch (e: any) {
            const status = e?.status ?? e?.data?.statusCode;
            const message = e?.data?.message;

            if (status === "FETCH_ERROR") {
                setError("Impossible de joindre le serveur.");
            } else if (status === 400 && typeof message === "string") {
                // "Lien invalide ou expiré" / "Lien déjà utilisé" / "Lien expiré"
                setError(message);
            } else {
                setError("Une erreur est survenue. Réessaie plus tard.");
            }
        }
    };

    if (success) {
        return (
            <AuthLayout
                eyebrow="MOT DE PASSE MIS À JOUR"
                title="Tout est bon"
                footer={{
                    mutedText: "Prêt à te reconnecter ?",
                    linkText: "Se connecter",
                    href: "/login",
                }}
            >
                <Text style={styles.successBig}>✅</Text>
                <Text style={styles.successMessage}>
                    Ton mot de passe a été réinitialisé avec succès.
                </Text>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            eyebrow="NOUVEAU MOT DE PASSE"
            title="Choisis un nouveau mot de passe"
            footer={{
                mutedText: "Tu t'en souviens finalement ?",
                linkText: "Se connecter",
                href: "/login",
            }}
        >
            <AuthField
                label="Nouveau mot de passe"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Au moins 8 caractères"
                secureTextEntry
                autoCapitalize="none"
            />

            <AuthField
                label="Confirme le mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Retape le mot de passe"
                secureTextEntry
                autoCapitalize="none"
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <AuthButton
                label={isLoading ? "MISE À JOUR…" : "RÉINITIALISER"}
                onPress={handleSubmit}
            />
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
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