import { UnrecoverableError } from "../types/errors";
import { Color, ColorSchema, TypographySchema, Typography } from "../types/penpot";

export const parseTypographyData = (data: string): Typography => {
  try {
    const typographyData = JSON.parse(data);
    typographyData.lineHeight = Number.parseFloat(String(typographyData.lineHeight));
    typographyData.letterSpacing = Number.parseFloat(String(typographyData.letterSpacing));
    const typography = TypographySchema.parse(typographyData);
    return typography;
  } catch (error) {
    throw new UnrecoverableError(`Failed to parse typography data: ${error.message}`);
  }
}

export const parseColorData = (data: string): Color => {
  try {
    const colorData = JSON.parse(data);
    const color = ColorSchema.parse(colorData);
    return color;
  } catch (error) {
    throw new UnrecoverableError(`Failed to parse color data: ${error.message}`);
  }
}
