import { UnrecoverableError } from "../types/errors";
import { Color, ColorSchema, TypographySchema, Typography } from "../types/penpot";

export const parseTypographyData = (data: string): Typography => {
  try {
    const typographyData = JSON.parse(data);
    // Convert string fields to numbers if they're still strings (for backward compatibility)
    if (typeof typographyData.lineHeight === 'string') {
      typographyData.lineHeight = Number.parseFloat(typographyData.lineHeight);
    }
    if (typeof typographyData.letterSpacing === 'string') {
      typographyData.letterSpacing = Number.parseFloat(typographyData.letterSpacing);
    }
    if (typeof typographyData.fontSize === 'string') {
      typographyData.fontSize = Number.parseFloat(typographyData.fontSize);
    }
    const typography = TypographySchema.parse(typographyData);
    return typography;
  } catch (error: unknown) {
    throw new UnrecoverableError(`Failed to parse typography data: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const parseColorData = (data: string): Color => {
  try {
    const colorData = JSON.parse(data);
    const color = ColorSchema.parse(colorData);
    return color;
  } catch (error: unknown) {
    throw new UnrecoverableError(`Failed to parse color data: ${error instanceof Error ? error.message : String(error)}`);
  }
}
