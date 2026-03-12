import { z } from 'zod';

// Flexible schema for Instagram export JSON structures
export const InstagramStringListItemSchema = z.object({
  href: z.string().optional(),
  value: z.string(),
  timestamp: z.number().optional(),
});

export const InstagramMediaListItemSchema = z.object({
  uri: z.string().optional(),
  creation_timestamp: z.number().optional(),
  title: z.string().optional(),
});

export const InstagramLabelValueSchema = z.object({
  label: z.string(),
  value: z.string().optional(),
  href: z.string().optional(),
  dict: z.array(z.any()).optional(),
});

export const InstagramPostSchema = z.object({
  timestamp: z.number(),
  media: z.array(InstagramMediaListItemSchema).optional(),
  label_values: z.array(InstagramLabelValueSchema).optional(),
  fbid: z.string().optional(),
});

export const InstagramCaptionSchema = z.object({
  text: z.string(),
  hashtags: z.array(z.string()).optional(),
});

export const InstagramContentItemSchema = z.object({
  title: z.string().optional(),
  media_list_data: z.array(InstagramMediaListItemSchema).optional(),
  string_list_data: z.array(InstagramStringListItemSchema).optional(),
  caption: InstagramCaptionSchema.optional(),
  timestamp: z.number().optional(),
});

// Generic array of Instagram items
export const InstagramExportArraySchema = z.array(z.any());

export type InstagramStringListItem = z.infer<typeof InstagramStringListItemSchema>;
export type InstagramMediaListItem = z.infer<typeof InstagramMediaListItemSchema>;
export type InstagramLabelValue = z.infer<typeof InstagramLabelValueSchema>;
export type InstagramPost = z.infer<typeof InstagramPostSchema>;
export type InstagramCaption = z.infer<typeof InstagramCaptionSchema>;
export type InstagramContentItem = z.infer<typeof InstagramContentItemSchema>;