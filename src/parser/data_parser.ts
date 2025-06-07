import { UnrecoverableError } from "../types/errors";
import { Color, ColorSchema, TypographySchema, Typography } from "../types/penpot";

export const parseTypographyData = (data: string): Typography => {
  try {
    const typographyData = JSON.parse(data);
    typographyData.lineHeight = Number.parseFloat(String(typographyData.lineHeight));
    typographyData.letterSpacing = Number.parseFloat(String(typographyData.letterSpacing));
    typographyData.fontSize = Number.parseFloat(String(typographyData.fontSize));
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
