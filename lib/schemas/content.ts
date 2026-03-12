import { z } from 'zod';

export const ContentTypeSchema = z.enum(['post', 'reel', 'story', 'unknown']);

export const ThemeSchema = z.enum([
  'fashion',
  'wellness',
  'creative-tech',
  'community',
  'mentorship',
  'identity',
  'product-idea',
  'offer',
  'brand-story',
]);

export const NormalizedContentSchema = z.object({
  id: z.string(),
  source: z.string(),
  type: ContentTypeSchema,
  caption: z.string().optional(),
  hashtags: z.array(z.string()),
  createdAt: z.date(),
  mediaFiles: z.array(z.string()),
  permalink: z.string().optional(),
  engagement: z.number().optional(),
  sourceFile: z.string(),
  sourcePath: z.string(),
  themes: z.array(ThemeSchema),
  themeConfidence: z.record(ThemeSchema, z.number()),
  summary: z.string().optional(),
});

export type ContentType = z.infer<typeof ContentTypeSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type NormalizedContent = z.infer<typeof NormalizedContentSchema>;