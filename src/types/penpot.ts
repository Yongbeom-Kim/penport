import { z } from "zod";

export const TypographySchema = z.object({
  lineHeight: z.number(),
  path: z.string().optional(),
  fontStyle: z.string(),
  textTransform: z.enum(["none", "uppercase", "capitalize"]),
  fontId: z.string(),
  fontSize: z.string(),
  fontWeight: z.string(),
  name: z.string(),
  modifiedAt: z.string(),
  fontVariantId: z.string(),
  id: z.string(),
  letterSpacing: z.number(),
  fontFamily: z.string()
});

export type Typography = z.infer<typeof TypographySchema>;

export const ColorSchema = z.object({
  path: z.string().optional(),
  color: z.string(),
  name: z.string(),
  modifiedAt: z.string(),
  opacity: z.number(),
  id: z.string()
});

export type Color = z.infer<typeof ColorSchema>;
