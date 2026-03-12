import { z } from 'zod';

export const ProductIdeaSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  price: z.number().optional(),
  category: z.string().optional(),
});

export const CollectionIdeaSchema = z.object({
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  products: z.array(z.string()).optional(),
});

export const ShopifyCopySchema = z.object({
  homepageSnippet: z.string().optional(),
  aboutSnippet: z.string().optional(),
  brandStorySnippet: z.string().optional(),
  productDescriptions: z.array(z.string()),
});

export const ShopifyAssetsSchema = z.object({
  productIdeas: z.array(ProductIdeaSchema),
  collectionIdeas: z.array(CollectionIdeaSchema),
  tags: z.array(z.string()),
  copy: ShopifyCopySchema,
});

export type ProductIdea = z.infer<typeof ProductIdeaSchema>;
export type CollectionIdea = z.infer<typeof CollectionIdeaSchema>;
export type ShopifyCopy = z.infer<typeof ShopifyCopySchema>;
export type ShopifyAssets = z.infer<typeof ShopifyAssetsSchema>;