export type FontStyle = "normal" | "italic";

export interface FontCut {
  family: string;
  weight: number;
  style: FontStyle;
  file: string;
}

export const DISPLAY_FAMILY = "ZT Bros Oskon 90s Expanded";
export const BODY_FAMILY = "ZT Bros Oskon 90s ExtraExpanded";

export const FONTS: FontCut[] = [
  { family: DISPLAY_FAMILY, weight: 700, style: "normal", file: "expanded-bold" },
  { family: DISPLAY_FAMILY, weight: 700, style: "italic", file: "expanded-bold-italic" },
  { family: BODY_FAMILY, weight: 400, style: "normal", file: "extraexpanded-regular" },
  { family: BODY_FAMILY, weight: 400, style: "italic", file: "extraexpanded-italic" },
  { family: BODY_FAMILY, weight: 700, style: "normal", file: "extraexpanded-bold" },
  { family: BODY_FAMILY, weight: 700, style: "italic", file: "extraexpanded-bold-italic" },
];
