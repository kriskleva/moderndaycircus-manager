import { NormalizedContent } from '../schemas/content';
import { ProductIdea } from '../schemas/shopify';
import { extractCaptionData } from '../instagram/extractCaptionData';

export function generateProductIdeas(contents: NormalizedContent[]): ProductIdea[] {
  const ideas: ProductIdea[] = [];

  // Group by themes
  const themeGroups: Record<string, NormalizedContent[]> = {};
  for (const content of contents) {
    for (const theme of content.themes) {
      if (!themeGroups[theme]) themeGroups[theme] = [];
      themeGroups[theme].push(content);
    }
  }

  // Generate ideas for each theme
  for (const [theme, themeContents] of Object.entries(themeGroups)) {
    if (themeContents.length < 2) continue; // Need some content

    const sampleContent = themeContents.slice(0, 3);
    const keywords = new Set<string>();

    for (const content of sampleContent) {
      const data = extractCaptionData(content);
      data.keywords.forEach(k => keywords.add(k));
      data.hashtags.forEach(h => keywords.add(h));
    }

    const keywordList = Array.from(keywords).slice(0, 5);

    // Generate product idea based on theme
    switch (theme) {
      case 'fashion':
        ideas.push({
          title: `Modern Day Circus ${keywordList[0] || 'Style'} Collection`,
          description: `Elevated fashion pieces inspired by creative community and personal expression. Featuring ${keywordList.slice(0, 3).join(', ')} elements.`,
          tags: ['fashion', 'style', 'modern', 'creative', ...keywordList],
          category: 'Apparel',
        });
        break;
      case 'wellness':
        ideas.push({
          title: `Wellness Ritual Kit`,
          description: `Curated wellness tools for mindfulness and self-care, blending technology and tradition.`,
          tags: ['wellness', 'mindfulness', 'ritual', 'self-care'],
          price: 89,
        });
        break;
      case 'creative-tech':
        ideas.push({
          title: `Creative Tech Companion`,
          description: `Digital tools and accessories for the modern creative professional.`,
          tags: ['technology', 'creative', 'innovation', 'tools'],
          category: 'Accessories',
        });
        break;
      case 'community':
        ideas.push({
          title: `Community Experience Package`,
          description: `Exclusive access to events, workshops, and networking opportunities.`,
          tags: ['community', 'events', 'networking', 'experience'],
          price: 149,
        });
        break;
      case 'mentorship':
        ideas.push({
          title: `Mentorship Program Access`,
          description: `Personalized guidance and coaching for creative growth and development.`,
          tags: ['mentorship', 'coaching', 'growth', 'guidance'],
          price: 299,
        });
        break;
      case 'identity':
        ideas.push({
          title: `Identity Expression Journal`,
          description: `A guided journal for exploring personal identity and creative expression.`,
          tags: ['identity', 'journal', 'expression', 'personal'],
          price: 24,
        });
        break;
    }
  }

  return ideas.slice(0, 10); // Limit to 10 ideas
}