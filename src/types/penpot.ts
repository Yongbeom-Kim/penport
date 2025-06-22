import { z } from "zod";

export const PointSchema = z.object({
  x: z.number(),
  y: z.number()
});

export const TransformSchema = z.object({
  a: z.number(),
  b: z.number(),
  c: z.number(),
  d: z.number(),
  e: z.number(),
  f: z.number()
});

export const SelrectSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number()
});

export const FillSchema = z.object({
  fillColor: z.string(),
  fillOpacity: z.number()
});

export const TextNodeSchema: z.ZodType<any> = z.lazy(() => z.object({
  lineHeight: z.string(),
  path: z.string(),
  fontStyle: z.string(),
  typographyRefId: z.string().nullable(),
  textTransform: z.string(),
  textAlign: z.string(),
  fontId: z.string(),
  fontSize: z.string(),
  fontWeight: z.string(),
  typographyRefFile: z.string().nullable(),
  textDirection: z.string(),
  modifiedAt: z.string(),
  fontVariantId: z.string(),
  textDecoration: z.string(),
  letterSpacing: z.string(),
  fills: z.array(FillSchema),
  fontFamily: z.string(),
  text: z.string().optional(),
  children: z.array(TextNodeSchema).optional(),
  type: z.string().optional(),
  key: z.string().optional()
}));

export const ContentSchema = z.object({
  type: z.literal("root"),
  children: z.array(z.object({
    type: z.literal("paragraph-set"),
    children: z.array(TextNodeSchema)
  }))
});

export const PositionDataSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  x1: z.number(),
  y1: z.number(),
  x2: z.number(),
  y2: z.number(),
  fontStyle: z.string(),
  textTransform: z.string(),
  fontSize: z.string(),
  fontWeight: z.string(),
  textDecoration: z.string(),
  letterSpacing: z.string(),
  fills: z.array(FillSchema),
  direction: z.string(),
  fontFamily: z.string(),
  text: z.string()
});

export const ShapeObjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  type: z.enum(["frame", "text"]),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number(),
  selrect: SelrectSchema,
  points: z.array(PointSchema),
  transform: TransformSchema,
  transformInverse: TransformSchema,
  parentId: z.string().uuid(),
  frameId: z.string().uuid(),
  flipX: z.null(),
  flipY: z.null(),
  hideFillOnExport: z.boolean().optional(),
  r2: z.number().optional(),
  proportionLock: z.boolean().optional(),
  r3: z.number().optional(),
  r1: z.number().optional(),
  strokes: z.array(z.any()).optional(),
  proportion: z.number().optional(),
  r4: z.number().optional(),
  fills: z.array(FillSchema).optional(),
  shapes: z.array(z.string().uuid()).optional(),
  growType: z.string().optional(),
  content: ContentSchema.optional(),
  hideInViewer: z.boolean().optional(),
  positionData: z.array(PositionDataSchema).optional()
});

export const GuideSchema = z.object({
  position: z.number(),
  frameId: z.null(),
  id: z.string().uuid(),
  axis: z.enum(["x", "y"])
});

export const PageSchema = z.object({
  options: z.record(z.any()),
  objects: z.record(ShapeObjectSchema),
  id: z.string().uuid(),
  name: z.string(),
  guides: z.record(GuideSchema)
});

export const TypographySchema = z.object({
  lineHeight: z.number(),
  path: z.string().optional(),
  fontStyle: z.string(),
  textTransform: z.string(),
  fontId: z.string(),
  fontSize: z.number(),
  fontWeight: z.string(),
  name: z.string(),
  modifiedAt: z.string(),
  fontVariantId: z.string(),
  id: z.string().uuid(),
  letterSpacing: z.number(),
  fontFamily: z.string()
});

export const ColorSchema = z.object({
  path: z.string().optional(),
  color: z.string(),
  name: z.string(),
  modifiedAt: z.string(),
  opacity: z.number(),
  id: z.string().uuid()
});

export const PermissionsSchema = z.object({
  type: z.string(),
  isOwner: z.boolean(),
  isAdmin: z.boolean(),
  canEdit: z.boolean(),
  canRead: z.boolean(),
  isLogged: z.boolean()
});

export const DataSchema = z.object({
  pages: z.array(z.string().uuid()),
  pagesIndex: z.record(PageSchema),
  id: z.string().uuid(),
  options: z.object({
    componentsV2: z.boolean()
  }),
  typographies: z.record(TypographySchema),
  colors: z.record(ColorSchema)
});

export const PenpotFileSchema = z.object({
  features: z.array(z.string()),
  teamId: z.string().uuid(),
  permissions: PermissionsSchema,
  hasMediaTrimmed: z.boolean(),
  commentThreadSeqn: z.number(),
  name: z.string(),
  revn: z.number(),
  modifiedAt: z.string().datetime(),
  vern: z.number(),
  id: z.string().uuid(),
  isShared: z.boolean(),
  migrations: z.array(z.string()),
  version: z.number(),
  projectId: z.string().uuid(),
  createdAt: z.string().datetime(),
  data: DataSchema
});

export type Point = z.infer<typeof PointSchema>;
export type Transform = z.infer<typeof TransformSchema>;
export type Selrect = z.infer<typeof SelrectSchema>;
export type Fill = z.infer<typeof FillSchema>;
export type TextNode = z.infer<typeof TextNodeSchema>;
export type Content = z.infer<typeof ContentSchema>;
export type PositionData = z.infer<typeof PositionDataSchema>;
export type ShapeObject = z.infer<typeof ShapeObjectSchema>;
export type Guide = z.infer<typeof GuideSchema>;
export type Page = z.infer<typeof PageSchema>;
export type Typography = z.infer<typeof TypographySchema>;
export type Color = z.infer<typeof ColorSchema>;
export type Permissions = z.infer<typeof PermissionsSchema>;
export type Data = z.infer<typeof DataSchema>;
export type PenpotFile = z.infer<typeof PenpotFileSchema>;
