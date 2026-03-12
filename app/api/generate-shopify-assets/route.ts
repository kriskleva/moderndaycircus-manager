import { NextRequest, NextResponse } from 'next/server';
import { normalizeInstagramExport } from '../../../lib/instagram/normalizeInstagram';
import { classifyContentBatch } from '../../../lib/ai/classifyContent';
import { generateProductIdeas } from '../../../lib/ai/generateProductIdeas';
import { generateShopifyCopy } from '../../../lib/ai/generateShopifyCopy';

export async function GET() {
  try {
    const normalizedContent = await normalizeInstagramExport();
    const classifiedContent = classifyContentBatch(normalizedContent);

    const productIdeas = generateProductIdeas(classifiedContent);
    const copy = generateShopifyCopy(classifiedContent);

    // Extract unique tags from content
    const allTags = new Set<string>();
    classifiedContent.forEach(content => {
      content.hashtags.forEach(tag => allTags.add(tag));
      content.themes.forEach(theme => allTags.add(theme));
    });

    const tags = Array.from(allTags).slice(0, 20); // Limit tags

    return NextResponse.json({
      success: true,
      assets: {
        productIdeas,
        collectionIdeas: [], // Could implement later
        tags,
        copy,
      },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate Shopify assets' },
      { status: 500 }
    );
  }
}