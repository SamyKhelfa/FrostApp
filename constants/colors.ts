/**
 * Centralized color palette for the Frost app.
 * Import from anywhere with:
 *   import { Colors } from "@/constants/colors";
 *
 * To change the entire app's theme, edit this file only.
 */

export const Colors = {
  // ─── Navy palette (backgrounds & primary text on light bg) ───
  navy: "#1A3553",            // main background
  navyAccent: "#1F4368",      // text on white, button bg, icons
  navyDeep: "#15314D",        // even deeper for shadows / pressed states

  // ─── Light tones (text & accents on dark bg) ─────────────────
  snow: "#FFFFFF",            // primary text on navy
  ice: "#B8D4F0",             // labels, secondary text, ice elements

  // ─── Muted greys (placeholders & helper texts) ───────────────
  muted: "#5B7A99",           // placeholders, inactive tab icons
  mutedDark: "#445A77",       // descriptions on white cards
  mutedSoft: "#8294AD",       // very subtle helper text
  mutedDate: "#9AA8BC",       // dates, fineprint

  // ─── Semantic colors ─────────────────────────────────────────
  danger: "#B23A48",          // logout, destructive actions
  dangerLight: "#E47585",     // error messages

  // ─── Borders & subtle UI ─────────────────────────────────────
  borderLight: "#E6EBF2",     // dividers on white cards
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
