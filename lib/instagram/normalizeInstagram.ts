import { NormalizedContent } from '../schemas/content';
import { scanExportDirectory } from './scanExportDirectory';
import { parseExportFile } from './parseExport';

export async function normalizeInstagramExport(): Promise<NormalizedContent[]> {
  console.log('Starting scan...');
  const scannedFiles = await scanExportDirectory();
  console.log(`Found ${scannedFiles.length} total files, ${scannedFiles.filter(f => f.isLikelyInstagramExport).length} Instagram files`);

  const instagramFiles = scannedFiles.filter(f => f.isLikelyInstagramExport);
  console.log('Instagram files found:', instagramFiles.slice(0, 3).map(f => f.relativePath));

  const allContent: NormalizedContent[] = [];

  for (const file of instagramFiles) { // Process all Instagram files
    console.log(`Processing ${file.relativePath}`);
    try {
      const content = await parseExportFile(file.filePath);
      console.log(`Extracted ${content.length} items from ${file.relativePath}`);
      if (content.length > 0) {
        console.log('Sample item:', JSON.stringify(content[0], null, 2));
      }
      allContent.push(...content);
    } catch (error) {
      console.error(`Error processing ${file.relativePath}:`, error);
    }
  }

  console.log(`Total content items extracted: ${allContent.length}`);

  // Deduplicate by ID
  const seen = new Set<string>();
  const deduplicated = allContent.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  console.log(`After deduplication: ${deduplicated.length} items`);
  return deduplicated;
}