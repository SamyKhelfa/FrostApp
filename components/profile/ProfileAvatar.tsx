import {Image, Pressable, StyleSheet, Text, View} from "react-native";

import { Colors } from "@/constants/colors";

type Props = {
    uri: string;
    onEdit: () => void;
    size?: number;
}

export function ProfileAvatar({uri, onEdit, size = 120}: Props){
    return(
        <View style={[styles.wrap, {width: size, height: size}]}>
            <Image
                source={{uri}}
            style={[styles.image, {width: size, height: size, borderRadius: size/2}]}
            />
            <Pressable style={styles.editButton} onPress={onEdit}>
                <Text style={styles.editIcon}>✎</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        position: "relative",
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 20,
        gap: 8,
        flex: 1,
    },
    image: {
    },
    editButton: {
        position: "absolute",
        bottom: 4,
        right: 4,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.navyAccent,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: Colors.snow,
    },
    editIcon: {
        color: Colors.snow,
        fontSize: 16,
        fontWeight: "700",
        marginTop: -2,
    },
});
