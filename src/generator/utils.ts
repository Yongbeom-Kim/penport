import { AssertionError } from "../types/errors";
import { Color } from "../types/penpot";

export const sanitizeCssIdentifier = (...fullPath: string[]) => {
  if (fullPath.length === 0) {
    throw new AssertionError("Cannot get CSS name, fullPath is required and cannot be empty");
  }
  return fullPath
    .filter(path => path !== undefined && path !== null && path !== "")
    .join("_")
    .toLowerCase()
    .replaceAll("/", "_")
    .replaceAll(" ", "-")
    .replaceAll(".", "_")
    .replaceAll(/[^a-z0-9_-]/g, "");
}

export const getColorCssName = (color: Color): string => {
  let cssVariableName = sanitizeCssIdentifier(color.path ?? "", color.name);
  
  if (cssVariableName === "") {
    throw new AssertionError(`Cannot generate CSS variable name for color: ${color.name}`);
  }
  
  if (!/^[a-z]/.test(cssVariableName)) {
    cssVariableName = `color-${cssVariableName}`;
  }
  
  return cssVariableName;
};

export const getColorValue = (color: Color): string => {
  if (color.opacity === 1) {
    return color.color;
  } else {
    const rgb = hexToRgb(color.color);
    return `rgba(${rgb}, ${color.opacity})`;
  }
};

export const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

export const pxToRem = (px: number): number => {
  return px / 16;
};

export const mapFontWeight = (weight: string): string => {
  const weightMap: Record<string, string> = {
    "100": "font-thin",
    "200": "font-extralight", 
    "300": "font-light",
    "400": "font-normal",
    "500": "font-medium",
    "600": "font-semibold",
    "700": "font-bold",
    "800": "font-extrabold",
    "900": "font-black"
  };
  
  return weightMap[weight] || "font-normal";
};

export const mapFontFamily = (family: string): string => {
  const sansSerifFonts = ["Inter", "Arial", "Helvetica", "sans-serif"];
  const serifFonts = ["Times", "Georgia", "serif"];
  const monoFonts = ["Monaco", "Consolas", "monospace"];
  
  if (sansSerifFonts.some(font => family.toLowerCase().includes(font.toLowerCase()))) {
    return "font-sans";
  }
  if (serifFonts.some(font => family.toLowerCase().includes(font.toLowerCase()))) {
    return "font-serif";
  }
  if (monoFonts.some(font => family.toLowerCase().includes(font.toLowerCase()))) {
    return "font-mono";
  }
  
  return "font-sans";
};

export const getTypographyCssName = (path: string, name: string): string => {
  return sanitizeCssIdentifier(path ?? "", name);
};

export const sanitizeFontFamilyName = (fontFamily: string): string => {
  return sanitizeCssIdentifier(fontFamily);
};

export const formatLetterSpacing = (spacing: number): string => {
  return spacing.toFixed(4).replace(/\.?0+$/, "");
};

export const mapTextTransform = (textTransform: string): string => {
  const transformMap: Record<string, string> = {
    none: "",
    capitalize: "capitalize",
    uppercase: "uppercase",
    lowercase: "lowercase",
  };

  return transformMap[textTransform] || "";
};

export const getFontFamilyCssVariableName = (fontFamily: string): string => {
  return `font-family-${fontFamily.trim().replaceAll(/\s+/g, "-").toLowerCase()}`;
};