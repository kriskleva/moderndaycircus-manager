import { NormalizedContent } from '../schemas/content';
import { extractHashtags } from '../utils/hashtags';
import { extractKeywords } from '../utils/text';

export interface CaptionData {
  text: string;
  hashtags: string[];
  keywords: string[];
  hasEmojis: boolean;
  length: number;
}

export function extractCaptionData(content: NormalizedContent): CaptionData {
  const text = content.caption || '';
  const hashtags = extractHashtags(text);
  const keywords = extractKeywords(text);
  const hasEmojis = /\p{Emoji}/u.test(text);

  return {
    text,
    hashtags,
    keywords,
    hasEmojis,
    length: text.length,
  };
}