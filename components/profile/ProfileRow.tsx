import {Pressable, StyleSheet, Text, View} from "react-native";
import {ReactNode} from "react";

type Variant = "default" | "primary" | "danger";

type Props = {
    icon: ReactNode,
    label: string
    onPress: () => void
    variant?: Variant
}

export function ProfileRow({icon, label, onPress, variant = "default"}: Props) {
    const isPrimary = variant === "primary";

    return (
        <Pressable
            onPress={onPress}
            style={({pressed}) => [
                styles.row,
                isPrimary && styles.rowPrimary,
                pressed && styles.rowPressed,
            ]}
        >
            <View style={styles.iconWrap}>{icon}</View>
            <Text style={[styles.label, isPrimary && styles.labelPrimary]}>
                {label}
            </Text>
            {!isPrimary && (
                <View style={styles.arrowCircle}>
                    <Text style={styles.arrow}>›</Text>
                </View>
            )}
        </Pressable>
    )
}

const NAVY = "#15375E";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
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
        color: NAVY,
        fontSize: 15,
        fontWeight: "600",
    },
    labelPrimary: {
        flex: 0,
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.5,
    },
    arrowCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: NAVY,
        alignItems: "center",
        justifyContent: "center",
    },
    arrow: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        marginTop: -2,
    },
});
