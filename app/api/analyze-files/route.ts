import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { scanExportDirectory } from '../../../lib/instagram/scanExportDirectory';
import { parseExportFile } from '../../../lib/instagram/parseExport';

interface FileAnalysis {
  file: {
    filePath: string;
    relativePath: string;
    size: number;
    isLikelyInstagramExport: boolean;
  };
  rawContent: any[];
  parsedContent: any[];
  error?: string;
  structure: string;
}

export async function GET() {
  try {
    const scannedFiles = await scanExportDirectory();
    const instagramFiles = scannedFiles.filter(f => f.isLikelyInstagramExport);

    const analyses: FileAnalysis[] = [];

    // Analyze first 20 files to avoid overwhelming the response
    for (const file of instagramFiles.slice(0, 20)) {
      try {
        const analysis = await analyzeFile(file);
        analyses.push(analysis);
      } catch (error) {
        console.error(`Error analyzing ${file.filePath}:`, error);
        analyses.push({
          file,
          rawContent: [],
          parsedContent: [],
          error: error instanceof Error ? error.message : 'Unknown error',
          structure: 'error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      files: analyses,
      totalFiles: instagramFiles.length,
      analyzedFiles: analyses.length,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze files' },
      { status: 500 }
    );
  }
}

async function analyzeFile(file: { filePath: string; relativePath: string; size: number; isLikelyInstagramExport: boolean }): Promise<FileAnalysis> {
  let rawContent: any[] = [];
  let parsedContent: any[] = [];
  let error: string | undefined;
  let structure = 'unknown';

  try {
    // Read raw content
    const content = fs.readFileSync(file.filePath, 'utf-8');
    const data = JSON.parse(content);

    if (Array.isArray(data)) {
      structure = 'array';
      rawContent = data.slice(0, 3); // Just first 3 items for preview
    } else if (typeof data === 'object' && data !== null) {
      structure = 'object';
      // Find the first array property
      for (const key in data) {
        if (Array.isArray(data[key])) {
          rawContent = data[key].slice(0, 3);
          structure = `object-with-${key}-array`;
          break;
        }
      }
      if (rawContent.length === 0) {
        rawContent = [data]; // Show the object itself
      }
    }

    // Try to parse with our logic
    const parsed = await parseExportFile(file.filePath);
    parsedContent = parsed.slice(0, 3); // Just first 3 parsed items

  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to analyze file';
  }

  return {
    file,
    rawContent,
    parsedContent,
    error,
    structure,
  };
}