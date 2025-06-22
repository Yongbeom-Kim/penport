import { AssertionError } from "../types/errors";
import { Color } from "../types/penpot";

/**
 * Sanitizes a CSS identifier by converting it to a valid CSS class/variable name
 */
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

/**
 * Generates a CSS variable name from a color's path and name
 * Uses the robust naming logic from generateCssColors
 */
export const getColorCssName = (color: Color): string => {
  let cssVariableName = sanitizeCssIdentifier(color.path ?? "", color.name);
  
  if (cssVariableName === "") {
    throw new AssertionError(`Cannot generate CSS variable name for color: ${color.name}`);
  }
  
  // Add color- prefix if name doesn't start with a letter
  if (!/^[a-z]/.test(cssVariableName)) {
    cssVariableName = `color-${cssVariableName}`;
  }
  
  return cssVariableName;
};

/**
 * Generates a CSS color value from a color object
 * Uses the robust color value logic from generateTailwindConfig
 */
export const getColorValue = (color: Color): string => {
  if (color.opacity === 1) {
    return color.color;
  } else {
    const rgb = hexToRgb(color.color);
    return `rgba(${rgb}, ${color.opacity})`;
  }
};

/**
 * Converts hex color to RGB values
 */
export const hexToRgb = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

/**
 * Converts pixels to rem units (assuming 16px base font size)
 */
export const pxToRem = (px: number): number => {
  return px / 16;
};

/**
 * Maps font weight values to Tailwind CSS font weight classes
 */
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

/**
 * Maps font family names to Tailwind CSS font family classes
 */
export const mapFontFamily = (family: string): string => {
  // Default to font-sans for common sans-serif fonts
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
  
  return "font-sans"; // Default fallback
};