export function toVimeoEmbedUrl(raw: string | null | undefined): string | null {
    if (!raw) return null;

    const value = raw.trim();
    if (!value) return null;

    if (/^\d+$/.test(value)) {
        return `https://player.vimeo.com/video/${value}`;
    }

    if (value.includes("player.vimeo.com/video/")) {
        return value;
    }

    const match = value.match(/vimeo\.com\/(\d+)(?:\/([0-9a-zA-Z]+))?/);
    if (!match) return null;

    const [, id, privacyHash] = match;

    return privacyHash
        ? `https://player.vimeo.com/video/${id}?h=${privacyHash}`
        : `https://player.vimeo.com/video/${id}`;
}
