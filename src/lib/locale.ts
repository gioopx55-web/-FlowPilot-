export type Direction = "ltr" | "rtl";

export interface Locale {
  lang: string;
  dir: Direction;
}

/**
 * Single seam for language/direction (Phase 2 D-017, Phase 5 §16).
 * V1 is English-only; swapping to Arabic later is a change to this
 * function only, not a template-wide search for hardcoded "en"/"ltr".
 */
export function getLocale(): Locale {
  return { lang: "en", dir: "ltr" };
}
