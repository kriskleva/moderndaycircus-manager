export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
}

export function cleanHashtags(hashtags: string[]): string[] {
  return hashtags
    .map(tag => tag.toLowerCase().trim())
    .filter(tag => tag.length > 0)
    .filter((tag, index, arr) => arr.indexOf(tag) === index); // deduplicate
}