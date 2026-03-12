import { NextRequest, NextResponse } from 'next/server';
import { scanExportDirectory } from '../../../lib/instagram/scanExportDirectory';

export async function GET() {
  try {
    const files = await scanExportDirectory();
    return NextResponse.json({
      success: true,
      files,
      totalFiles: files.length,
      instagramFiles: files.filter(f => f.isLikelyInstagramExport).length,
    });
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to scan export directory' },
      { status: 500 }
    );
  }
}