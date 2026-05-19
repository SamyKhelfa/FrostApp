import { ScrollView, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import {ProfileRow} from "@/components/profile/ProfileRow";
import {ProfileAvatar} from "@/components/profile/ProfileAvatar";
import LogoutIcon from "@/assets/images/logout.svg"
import ProfileIcon from "@/assets/images/profile.svg"
import PasswordIcon from "@/assets/images/password.svg"
import { Colors } from "@/constants/colors";

export default function Profile() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <ProfileAvatar
                uri="https://maximefrost.fr/wp-content/uploads/2024/06/Maxime-Frost-Presensation-Stage-Givre.jpg"
                onEdit={() => {
                }}
            />
            <ProfileRow
                icon={<ProfileIcon width={24} height={24} fill={Colors.navy}/> }
                label="Modifier le profil"
                onPress={() => router.push("/edit-profile")}
            />

            <ProfileRow
                icon={<PasswordIcon width={24} height={24} fill={Colors.navy} />}
                label="Modifier le mot de passe"
                onPress={() => router.push("/change-password")}
            />

            <ProfileRow
                icon={<Text style={styles.emojiIcon}>💳</Text>}
                label="Abonnement"
                onPress={() => router.push("/subscription")}
            />

            <ProfileRow
                icon={<Text style={styles.emojiIcon}>📄</Text>}
                label="Termes et conditions"
                onPress={() => router.push("/terms")}
            />

            <ProfileRow
                icon={<Text style={styles.emojiIcon}>🔐</Text>}
                label="Politique de confidentialité"
                onPress={() => router.push("/privacy")}
            />

            <ProfileRow
                icon={<LogoutIcon width={20} height={20} fill={Colors.snow} />}
                label="Se déconnecter"
                onPress={() => router.push("/logout")}
                variant="danger"
            />

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
        paddingTop: 60,
    },
    emojiIcon: {
        fontSize: 20,
    },
});
