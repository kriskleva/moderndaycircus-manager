import { NormalizedContent, Theme } from '../schemas/content';
import { extractCaptionData } from '../instagram/extractCaptionData';

const THEME_KEYWORDS: Record<Theme, string[]> = {
  fashion: ['fashion', 'style', 'outfit', 'wear', 'clothing', 'dress', 'look', 'aesthetic'],
  wellness: ['wellness', 'health', 'mindfulness', 'meditation', 'yoga', 'fitness', 'self-care', 'healing'],
  'creative-tech': ['technology', 'creative', 'innovation', 'digital', 'app', 'tool', 'software', 'design'],
  community: ['community', 'together', 'group', 'people', 'connection', 'social', 'network', 'friends'],
  mentorship: ['mentor', 'teaching', 'learn', 'guide', 'coach', 'advice', 'wisdom', 'growth'],
  identity: ['identity', 'self', 'personal', 'authentic', 'expression', 'being', 'soul', 'purpose'],
  'product-idea': ['product', 'idea', 'create', 'build', 'launch', 'market', 'sell', 'business'],
  offer: ['offer', 'service', 'program', 'course', 'workshop', 'event', 'experience'],
  'brand-story': ['story', 'brand', 'journey', 'vision', 'mission', 'values', 'narrative', 'legacy'],
};

export function classifyContent(content: NormalizedContent): NormalizedContent {
  const captionData = extractCaptionData(content);
  const text = captionData.text.toLowerCase();
  const hashtags = content.hashtags.map(h => h.toLowerCase());

  const themes: Theme[] = [];
  const themeConfidence: Record<Theme, number> = {
    fashion: 0,
    wellness: 0,
    'creative-tech': 0,
    community: 0,
    mentorship: 0,
    identity: 0,
    'product-idea': 0,
    offer: 0,
    'brand-story': 0,
  };

  // Calculate confidence for each theme
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS) as [Theme, string[]][]) {
    let score = 0;
    const totalKeywords = keywords.length;

    for (const keyword of keywords) {
      if (text.includes(keyword)) score += 1;
      if (hashtags.includes(keyword)) score += 2; // Hashtags weight more
    }

    const confidence = totalKeywords > 0 ? score / totalKeywords : 0;
    themeConfidence[theme] = Math.min(confidence, 1); // Cap at 1

    if (confidence > 0.3) { // Threshold for inclusion
      themes.push(theme);
    }
  }

  // If no themes detected, add default
  if (themes.length === 0) {
    themes.push('identity');
    themeConfidence.identity = 0.1;
  }

  return {
    ...content,
    themes,
    themeConfidence,
  };
}

export function classifyContentBatch(contents: NormalizedContent[]): NormalizedContent[] {
  return contents.map(classifyContent);
}