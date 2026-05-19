/**
 * Centralized color palette for the Frost app.
 * Import from anywhere with:
 *   import { Colors } from "@/constants/colors";
 *
 * To change the entire app's theme, edit this file only.
 */

export const Colors = {
  // ─── Navy palette (navbar bg + dark text/icons on light bg) ──
  navy: "#1A3553",            // navbar background only
  navyAccent: "#1F4368",      // primary text, button bg, icons
  navyDeep: "#15314D",        // even deeper for shadows / pressed states

  // ─── App backgrounds (light) ─────────────────────────────────
  appBg: "#EEF3FA",           // main screen background
  surface: "#FFFFFF",         // cards, inputs

  // ─── Light tones (still used inside navbar) ──────────────────
  snow: "#FFFFFF",            // text on navy navbar / dark buttons
  ice: "#B8D4F0",             // navbar inactive accents

  // ─── Muted greys (placeholders & helper texts) ───────────────
  muted: "#5B7A99",           // placeholders, inactive tab icons, labels
  mutedDark: "#445A77",       // body text on light bg
  mutedSoft: "#8294AD",       // very subtle helper text
  mutedDate: "#9AA8BC",       // dates, fineprint

  // ─── Semantic colors ─────────────────────────────────────────
  danger: "#B23A48",          // logout, destructive actions
  dangerLight: "#E47585",     // error messages

  // ─── Borders & subtle UI ─────────────────────────────────────
  borderLight: "#E6EBF2",     // dividers / input borders on light bg
  iceLight: "#F2F6FB",        // very light tint backgrounds
  iceBorder: "#D4E2F2",       // borders for subchapter indents
};

// Alpha overlays (used in glassmorphism cards on navy)
export const Alpha = {
  white06: "rgba(255, 255, 255, 0.06)",
  white05: "rgba(255, 255, 255, 0.05)",
  white04: "rgba(255, 255, 255, 0.04)",
  iceBorder25: "rgba(184, 212, 240, 0.25)",
  iceBorder20: "rgba(184, 212, 240, 0.2)",
  iceBorder15: "rgba(184, 212, 240, 0.15)",
  iceBorder12: "rgba(184, 212, 240, 0.12)",
  iceBorder10: "rgba(184, 212, 240, 0.1)",
};
