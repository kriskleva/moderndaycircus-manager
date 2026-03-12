import fs from 'fs';
import path from 'path';
import { INSTAGRAM_EXPORT_DIR } from './config';

export interface ScannedFile {
  filePath: string;
  relativePath: string;
  size: number;
  isLikelyInstagramExport: boolean;
}

export async function scanExportDirectory(): Promise<ScannedFile[]> {
  const files: ScannedFile[] = [];

  async function scanDir(dirPath: string, relativeBase: string = ''): Promise<void> {
    try {
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const relativePath = path.join(relativeBase, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          await scanDir(fullPath, relativePath);
        } else if (stat.isFile() && item.endsWith('.json')) {
          const isLikelyInstagram = await isLikelyInstagramFile(fullPath);
          files.push({
            filePath: fullPath,
            relativePath,
            size: stat.size,
            isLikelyInstagramExport: isLikelyInstagram,
          });
        }
      }
    } catch (error) {
      console.warn(`Error scanning directory ${dirPath}:`, error);
    }
  }

  await scanDir(INSTAGRAM_EXPORT_DIR);
  return files;
}

async function isLikelyInstagramFile(filePath: string): Promise<boolean> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Check for common Instagram export patterns
    if (Array.isArray(data)) {
      // Check if array contains objects with Instagram-like structure
      if (data.length > 0) {
        const firstItem = data[0];
        if (typeof firstItem === 'object' && firstItem !== null) {
          // Look for timestamp, string_list_data, media_list_data, etc.
          const hasTimestamp = 'timestamp' in firstItem;
          const hasStringList = 'string_list_data' in firstItem;
          const hasMediaList = 'media_list_data' in firstItem;
          const hasLabelValues = 'label_values' in firstItem;
          // Check for media arrays (posts_1.json structure)
          const hasMediaArray = 'media' in firstItem && Array.isArray(firstItem.media);

          return hasTimestamp || hasStringList || hasMediaList || hasLabelValues || hasMediaArray;
        }
      }
    } else if (typeof data === 'object' && data !== null) {
      // Check for object structures with array properties (like settings files)
      for (const key in data) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          const firstItem = data[key][0];
          if (typeof firstItem === 'object' && firstItem !== null) {
            const hasTimestamp = 'timestamp' in firstItem;
            const hasStringMap = 'string_map_data' in firstItem;
            const hasStringList = 'string_list_data' in firstItem;
            const hasMediaList = 'media_list_data' in firstItem;
            // Check for media arrays in nested structures (reels.json structure)
            const hasMediaArray = 'media' in firstItem && Array.isArray(firstItem.media);

            if (hasTimestamp || hasStringMap || hasStringList || hasMediaList || hasMediaArray) {
              return true;
            }
          }
        }
      }
      // Check for top-level media arrays (reels.json has ig_reels_media array)
      const hasIgReelsMedia = 'ig_reels_media' in data && Array.isArray(data.ig_reels_media);
      if (hasIgReelsMedia) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}