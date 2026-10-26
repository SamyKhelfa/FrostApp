import { Colors } from "@/constants/colors";

const palette = Colors.authorPalette;

export function buildAuthorColors(
    userIds: readonly number[],
): Record<number, string> {
    const ordered = [...new Set(userIds)].sort((a, b) => a - b);

    return ordered.reduce<Record<number, string>>((colors, userId, index) => {
        colors[userId] = palette[index % palette.length];
        return colors;
    }, {});
}

export function fallbackAuthorColor(userId: number | undefined): string {
    if (userId === undefined) return palette[0];

    return palette[Math.abs(userId) % palette.length];
}
