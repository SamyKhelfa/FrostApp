import {Pressable, StyleSheet, Text, View} from "react-native";
import {ReactNode} from "react";

import { Colors } from "@/constants/colors";

type Variant = "default" | "primary" | "danger";

type Props = {
    icon: ReactNode,
    label: string
    onPress: () => void
    variant?: Variant
}

export function ProfileRow({icon, label, onPress, variant = "default"}: Props) {
    const isPrimary = variant === "primary";
    const isDanger = variant === "danger";
    const isSolid = isPrimary || isDanger;

    return (
        <Pressable
            onPress={onPress}
            style={({pressed}) => [
                styles.row,
                isPrimary && styles.rowPrimary,
                isDanger && styles.rowDanger,
                pressed && styles.rowPressed,
            ]}
        >
            <View style={styles.iconWrap}>{icon}</View>
            <Text
                style={[
                    styles.label,
                    isSolid && styles.labelSolid,
                ]}
            >
                {label}
            </Text>
            {!isSolid && (
                <View style={styles.arrowCircle}>
                    <Text style={styles.arrow}>›</Text>
                </View>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.snow,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 18,
        gap: 14,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    rowPrimary: {
        backgroundColor: "#000000",
        justifyContent: "center",
        paddingVertical: 18,
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    rowDanger: {
        backgroundColor: Colors.danger,
        justifyContent: "center",
        paddingVertical: 12,
        marginHorizontal: 40,
        marginTop: 20,
        shadowColor: Colors.danger,
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    rowPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },
    iconWrap: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        flex: 1,
        color: Colors.navyAccent,
        fontSize: 15,
        fontWeight: "600",
    },
    labelSolid: {
        flex: 0,
        color: Colors.snow,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    arrowCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.navyAccent,
        alignItems: "center",
        justifyContent: "center",
    },
    arrow: {
        color: Colors.snow,
        fontSize: 18,
        fontWeight: "700",
        marginTop: -2,
    },
});
