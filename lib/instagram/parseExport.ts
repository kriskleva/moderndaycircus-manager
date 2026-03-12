import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { InstagramExportArraySchema } from '../schemas/instagram';
import { NormalizedContent, NormalizedContentSchema } from '../schemas/content';
import { extractHashtags } from '../utils/hashtags';
import { timestampToDate } from '../utils/dates';
import { cleanText, generateSummary } from '../utils/text';

export async function parseExportFile(filePath: string): Promise<NormalizedContent[]> {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    let items: any[] = [];

    // Handle different Instagram export structures
    if (Array.isArray(data)) {
      // Check if items have nested media arrays (like posts_1.json)
      if (data.length > 0 && data[0].media && Array.isArray(data[0].media)) {
        // Flatten the media arrays from each item
        items = data.flatMap(item => item.media || []);
      } else {
        items = data;
      }
    } else if (typeof data === 'object' && data !== null) {
      // Find array properties in object structures
      for (const key in data) {
        if (Array.isArray(data[key])) {
          const arrayData = data[key];
          // Check if items in the array have nested media arrays
          if (arrayData.length > 0 && arrayData[0].media && Array.isArray(arrayData[0].media)) {
            // Flatten the media arrays from each item
            items = arrayData.flatMap(item => item.media || []);
          } else {
            items = arrayData;
          }
          break; // Use the first array found
        }
      }
    }

    const normalizedItems: NormalizedContent[] = [];

    for (const item of items) {
      try {
        const normalized = normalizeInstagramItem(item, filePath);
        if (normalized) {
          normalizedItems.push(normalized);
        }
      } catch (error) {
        console.warn(`Failed to normalize item in ${filePath}:`, error);
      }
    }

    return normalizedItems;
  } catch (error) {
    console.warn(`Failed to parse ${filePath}:`, error);
    return [];
  }
}

function normalizeInstagramItem(item: any, sourceFile: string): NormalizedContent | null {
  // Determine type based on structure
  let type: 'post' | 'reel' | 'story' | 'unknown' = 'unknown';
  let caption = '';
  let hashtags: string[] = [];
  let createdAt: Date | undefined;
  let mediaFiles: string[] = [];
  let permalink: string | undefined;
  let engagement: number | undefined;

  // Check for media object structure (from posts, reels, stories)
  if (item.uri && item.creation_timestamp) {
    // Determine type based on filename and URI
    const fileName = path.basename(sourceFile, '.json');
    if (fileName.includes('reel') || item.uri.includes('/reels/')) {
      type = 'reel';
    } else if (fileName.includes('stories') || item.uri.includes('/stories/')) {
      type = 'story';
    } else {
      type = 'post';
    }

    createdAt = timestampToDate(item.creation_timestamp);
    caption = item.title || '';
    mediaFiles = [item.uri];

    // Extract hashtags from caption
    hashtags = extractHashtags(caption);
  }

  // Check for post-like structure (from liked_posts.json, ads, etc.)
  if (item.timestamp && item.label_values) {
    type = 'post';
    createdAt = timestampToDate(item.timestamp);

    // Extract URL from label_values
    const urlLabel = item.label_values.find((lv: any) => lv.label === 'URL');
    if (urlLabel?.href) {
      permalink = urlLabel.href;
    }

    // Extract owner info for caption context
    const ownerLabel = item.label_values.find((lv: any) => lv.label === 'Owner');
    if (ownerLabel?.dict?.[0]?.dict) {
      const ownerInfo = ownerLabel.dict[0].dict;
      const name = ownerInfo.find((d: any) => d.label === 'Name')?.value;
      const username = ownerInfo.find((d: any) => d.label === 'Username')?.value;
      if (name || username) {
        caption = `Post by ${name || username}`;
      }
    }

    // For ads and other content, try to extract any available text
    const actionLabel = item.label_values.find((lv: any) => lv.label === 'Action');
    if (actionLabel?.value) {
      caption = caption ? `${caption} - ${actionLabel.value}` : actionLabel.value;
    }

    // If still no caption, create a generic one based on the content type
    if (!caption) {
      const fileName = path.basename(sourceFile, '.json');
      if (fileName.includes('ads') || fileName.includes('advertisers')) {
        caption = `Ad interaction on Instagram`;
      } else if (fileName.includes('liked')) {
        caption = `Liked content on Instagram`;
      } else {
        caption = `Instagram activity: ${fileName.replace(/_/g, ' ')}`;
      }
    }
  }

  // Check for string_list_data (followers, etc.)
  else if (item.string_list_data) {
    // This might be followers or similar
    const stringItem = item.string_list_data[0];
    if (stringItem) {
      caption = stringItem.value || '';
      if (stringItem.timestamp) {
        createdAt = timestampToDate(stringItem.timestamp);
      }
      if (stringItem.href) {
        permalink = stringItem.href;
      }
    }

    // Determine type based on filename
    const fileName = path.basename(sourceFile, '.json');
    if (fileName.includes('follow')) {
      type = 'post'; // Treat as social connection content
      if (!caption) caption = `Follow activity on Instagram`;
    }
  }

  // Fallback for any item with a timestamp
  else if (item.timestamp) {
    createdAt = timestampToDate(item.timestamp);
    type = 'post';
    const fileName = path.basename(sourceFile, '.json');
    caption = `Instagram activity: ${fileName.replace(/_/g, ' ')}`;
  }

  // If we still don't have basic info, skip this item
  if (!createdAt && !caption) {
    return null;
  }

  // Extract hashtags from caption
  hashtags = extractHashtags(caption);

  // Generate summary
  const summary = generateSummary(caption);

  // Create stable ID
  const id = `${path.basename(sourceFile)}-${item.timestamp || item.fbid || Math.random()}`;

  const normalized: NormalizedContent = {
    id,
    source: 'instagram',
    type,
    caption: caption || undefined,
    hashtags,
    createdAt: createdAt || new Date(),
    mediaFiles,
    permalink,
    engagement,
    sourceFile: path.basename(sourceFile),
    sourcePath: sourceFile,
    themes: [], // Will be filled by classifier
    themeConfidence: {
      fashion: 0,
      wellness: 0,
      'creative-tech': 0,
      community: 0,
      mentorship: 0,
      identity: 0,
      'product-idea': 0,
      offer: 0,
      'brand-story': 0,
    },
    summary,
  };

  // Validate
  const validation = NormalizedContentSchema.safeParse(normalized);
  if (!validation.success) {
    console.warn('Validation failed for item:', validation.error.issues);
    return null;
  }
  return normalized;
}