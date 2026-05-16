import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import {ProfileRow} from "@/components/profile/ProfileRow";
import {ProfileAvatar} from "@/components/profile/ProfileAvatar";
import LogoutIcon from "@/assets/images/logout.svg"
import ProfileIcon from "@/assets/images/profile.svg"

export default function Profile() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <ProfileAvatar
                uri="https://maximefrost.fr/wp-content/uploads/2024/06/Maxime-Frost-Presensation-Stage-Givre.jpg"
                onEdit={() => {
                }}
            />
            <ProfileRow
                icon={<ProfileIcon width={24} height={24} fill="#0E2645"/> }
                label="Modifier le profil"
                onPress={() => router.push("/edit-profile")}
            />

            <ProfileRow
                icon="🔒"
                label="Modifier le mot de passe"
                onPress={() => router.push("/change-password")}
            />

            <ProfileRow
                icon={<LogoutIcon width={20} height={20} fill="#FFFFFF" />}
                label="Se déconnecter"
                onPress={() => router.push("/logout")}
                variant="primary"
            />

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0E2645",
    },
    content: {
        padding: 24,
        paddingTop: 60,
    },
    topBar: {
        // ...
    },
    backArrow: {
        color: "white",
        fontSize: 28,
    },
});