import { NormalizedContent } from '../schemas/content';
import { ShopifyCopy } from '../schemas/shopify';

export function generateShopifyCopy(contents: NormalizedContent[]): ShopifyCopy {
  const brandContents = contents.filter(c => c.themes.includes('brand-story'));
  const identityContents = contents.filter(c => c.themes.includes('identity'));
  const communityContents = contents.filter(c => c.themes.includes('community'));

  const homepageSnippet = brandContents.length > 0
    ? `Welcome to Modern Day Circus, where creativity meets community. ${brandContents[0].summary || 'Discover your unique path.'}`
    : 'Modern Day Circus: Where creativity, wellness, and community converge.';

  const aboutSnippet = identityContents.length > 0
    ? `We believe in the power of creative expression and authentic living. ${identityContents[0].summary || 'Join our community of dreamers and doers.'}`
    : 'Modern Day Circus is a creative lifestyle brand blending fashion, wellness, and technology with community and mentorship.';

  const brandStorySnippet = communityContents.length > 0
    ? `Our story began with a vision of connecting creative minds. ${communityContents[0].summary || 'Today, we build bridges between technology and humanity.'}`
    : 'Founded on the principles of creativity and connection, Modern Day Circus empowers individuals to express their authentic selves.';

  const productDescriptions = [
    'Elevated design meets practical functionality in this piece from our creative collection.',
    'Crafted with intention for the modern creative professional who values both style and substance.',
    'A thoughtful addition to your daily ritual, blending wellness and innovation.',
    'Designed for those who seek meaningful connections in an increasingly digital world.',
    'Where technology enhances rather than replaces human creativity and expression.',
  ];

  return {
    homepageSnippet,
    aboutSnippet,
    brandStorySnippet,
    productDescriptions,
  };
}