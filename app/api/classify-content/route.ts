import { NextRequest, NextResponse } from 'next/server';
import { normalizeInstagramExport } from '../../../lib/instagram/normalizeInstagram';
import { classifyContentBatch } from '../../../lib/ai/classifyContent';

export async function GET() {
  try {
    console.log('Starting Instagram export normalization...');
    const normalizedContent = await normalizeInstagramExport();
    console.log(`Normalized ${normalizedContent.length} content items`);

    const classifiedContent = classifyContentBatch(normalizedContent);
    console.log(`Classified ${classifiedContent.length} content items`);

    // Return debug info
    return NextResponse.json({
      success: true,
      content: classifiedContent,
      totalItems: classifiedContent.length,
      debug: {
        normalizedCount: normalizedContent.length,
        classifiedCount: classifiedContent.length,
        sampleContent: normalizedContent.slice(0, 2),
      },
    });
  } catch (error: unknown) {
    console.error('Classification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to classify content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}