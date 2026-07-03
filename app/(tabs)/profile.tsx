import { ScrollView, StyleSheet, Text, Alert } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {ProfileRow} from "@/components/profile/ProfileRow";
import {ProfileAvatar} from "@/components/profile/ProfileAvatar";
import LogoutIcon from "@/assets/images/logout.svg"
import ProfileIcon from "@/assets/images/profile.svg"
import PasswordIcon from "@/assets/images/password.svg"
import { Colors } from "@/constants/colors";
import { useAuth } from "@/core/context/AuthContext";
import * as ImagePicker from "expo-image-picker"
import {useUploadAvatarMutation} from "@/core/api";

const FLOATING_TAB_BAR_CONTENT_PAD = 96;

export default function Profile() {
    const insets = useSafeAreaInsets();
    const { user, logout } = useAuth();
    const bottomPad = FLOATING_TAB_BAR_CONTENT_PAD + Math.max(insets.bottom, 14);

    const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();

    const handleEditAvatar = () => {
        Alert.alert(
            "Modifier la photo",
            "Choisis une option",
            [
                { text: "Galerie", onPress: pickFromGallery },
                { text: "Prendre une photo", onPress: takePhoto },
                { text: "Annuler", style: "cancel" },
            ]
        );
    };

    const pickFromGallery = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
            Alert.alert("Permission refusée", "Autorise l'accès aux photos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            await uploadFile(result.assets[0]);
        }
    };

    const takePhoto = async () => {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
            Alert.alert("Permission refusée", "Autorise l'accès à la caméra.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            await uploadFile(result.assets[0]);
        }
    };

    const uploadFile = async (asset: ImagePicker.ImagePickerAsset) => {
        try {
            const formData = new FormData();
            formData.append("file", {
                uri: asset.uri,
                name: "avatar.jpg",
                type: "image/jpeg",
            } as any);

            await uploadAvatar(formData).unwrap();
        } catch (e: any) {
            Alert.alert(
                "Erreur",
                e?.data?.message || "Impossible d'uploader la photo.",
            );
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}>
            <ProfileAvatar
                uri={user?.avatar}
                name={user?.name}
                onEdit={handleEditAvatar}
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
                onPress={logout}
                variant="danger"
            />

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
        paddingTop: 60,
    },
    emojiIcon: {
        fontSize: 20,
    },
});
