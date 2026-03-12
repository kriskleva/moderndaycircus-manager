export function cleanText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export function generateSummary(text: string, maxLength: number = 100): string {
  const cleaned = cleanText(text);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength - 3) + '...';
}

export function extractKeywords(text: string): string[] {
  // Simple keyword extraction - split by spaces and filter common words
  const words = text.toLowerCase().split(/\s+/);
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those']);
  return words
    .filter(word => word.length > 2)
    .filter(word => !stopWords.has(word))
    .filter((word, index, arr) => arr.indexOf(word) === index);
}