export type VideoEmbed = {
    url: string;
    origin: string;
};

const VIMEO_URL = /vimeo\.com\/(\d+)(?:\/([0-9a-zA-Z]+))?/;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

const YOUTUBE_ORIGIN = "https://www.youtube.com";
const VIMEO_ORIGIN = "https://player.vimeo.com";

function youtubeEmbed(id: string): VideoEmbed {
    return {
        url: `${YOUTUBE_ORIGIN}/embed/${id}?rel=0&playsinline=1`,
        origin: YOUTUBE_ORIGIN,
    };
}

function vimeoEmbed(value: string): VideoEmbed | null {
    if (/^\d+$/.test(value)) {
        return { url: `${VIMEO_ORIGIN}/video/${value}`, origin: VIMEO_ORIGIN };
    }

    if (value.includes("player.vimeo.com/video/")) {
        return { url: value, origin: VIMEO_ORIGIN };
    }

    const match = value.match(VIMEO_URL);
    if (!match) return null;

    const [, id, privacyHash] = match;

    return {
        url: privacyHash
            ? `${VIMEO_ORIGIN}/video/${id}?h=${privacyHash}`
            : `${VIMEO_ORIGIN}/video/${id}`,
        origin: VIMEO_ORIGIN,
    };
}

function youtubeIdFrom(value: string): string | null {
    const patterns = [
        /youtube\.com\/watch\?(?:[^#]*&)?v=([A-Za-z0-9_-]{11})/,
        /youtu\.be\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
        /youtube\.com\/live\/([A-Za-z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
        const match = value.match(pattern);
        if (match) return match[1];
    }

    return null;
}

export function toVideoEmbed(raw: string | null | undefined): VideoEmbed | null {
    if (!raw) return null;

    const value = raw.trim();
    if (!value) return null;

    if (value.includes("youtube.com") || value.includes("youtu.be")) {
        const id = youtubeIdFrom(value);
        return id ? youtubeEmbed(id) : null;
    }

    if (value.includes("vimeo.com") || /^\d+$/.test(value)) {
        return vimeoEmbed(value);
    }

    return YOUTUBE_ID.test(value) ? youtubeEmbed(value) : null;
}

export function embedHtml({ url }: VideoEmbed): string {
    return `<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></head>
<body style="margin:0;padding:0;background:#000;overflow:hidden">
<iframe src="${url}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0"></iframe>
</body>
</html>`;
}
