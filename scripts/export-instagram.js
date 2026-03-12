#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { normalizeInstagramExport } from '../lib/instagram/normalizeInstagram.ts';
import { classifyContentBatch } from '../lib/ai/classifyContent.ts';

async function exportInstagramData() {
  console.log('🔄 Starting Instagram data export...');

  try {
    // Get normalized content
    const normalizedContent = await normalizeInstagramExport();
    console.log(`📊 Found ${normalizedContent.length} normalized content items`);

    if (normalizedContent.length === 0) {
      console.log('⚠️ No content found. This might be because only ad-related files are being processed.');
      console.log('💡 Try running the app and checking the /analyze page to see what files contain actual posts.');
      return;
    }

    // Classify content to get themes
    console.log('⏭️ Skipping classification for now to test basic export...');
    const classifiedContent = normalizedContent.map(content => ({
      ...content,
      themes: ['identity'],
      themeConfidence: {
        fashion: 0,
        wellness: 0,
        'creative-tech': 0,
        community: 0,
        mentorship: 0,
        identity: 0.1,
        'product-idea': 0,
        offer: 0,
        'brand-story': 0,
      }
    }));

    // Create data directory
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Export CSV
    await exportToCSV(classifiedContent, dataDir);

    // Export Markdown Summary
    await exportToMarkdown(classifiedContent, dataDir);

    console.log('✅ Export complete!');
    console.log(`📁 Files created in: ${dataDir}`);
    console.log(`   - instagram-content-export.csv`);
    console.log(`   - instagram-brand-summary.md`);

  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

async function exportToCSV(content, dataDir) {
  const csvPath = path.join(dataDir, 'instagram-content-export.csv');

  // CSV Header
  const headers = [
    'id',
    'type',
    'createdAt',
    'caption',
    'hashtags',
    'themes',
    'summary',
    'sourceFile',
    'sourcePath'
  ];

  // CSV Rows
  const rows = content.map(item => [
    item.id,
    item.type,
    item.createdAt.toISOString(),
    `"${(item.caption || '').replace(/"/g, '""')}"`, // Escape quotes
    `"${(item.hashtags || []).join(', ')}"`,
    `"${(item.themes || []).join(', ')}"`,
    `"${(item.summary || '').replace(/"/g, '""')}"`,
    item.sourceFile || '',
    item.sourcePath || ''
  ]);

  // Combine header and rows
  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  fs.writeFileSync(csvPath, csvContent, 'utf-8');
  console.log(`📄 CSV exported: ${content.length} rows`);
}

async function exportToMarkdown(content, dataDir) {
  const mdPath = path.join(dataDir, 'instagram-brand-summary.md');

  // Calculate statistics
  const totalItems = content.length;
  const typeCounts = getTypeCounts(content);
  const themeCounts = getThemeCounts(content);
  const topHashtags = getTopHashtags(content);
  const strongCaptions = getStrongCaptions(content);
  const contentClusters = getContentClusters(content);
  const shopifyCollections = suggestShopifyCollections(content);
  const productIdeas = suggestProductIdeas(content);
  const homepageCopy = generateHomepageCopy(content);

  // Generate markdown
  const markdown = `# Modern Day Circus - Instagram Brand Summary

Generated on: ${new Date().toISOString().split('T')[0]}

## 📊 Overview

- **Total Content Items**: ${totalItems}
- **Content Types**: ${Object.keys(typeCounts).length}
- **Unique Themes**: ${Object.keys(themeCounts).length}
- **Total Hashtags**: ${topHashtags.length}

## 📈 Content by Type

${Object.entries(typeCounts)
  .sort(([,a], [,b]) => b - a)
  .map(([type, count]) => `- **${type}**: ${count} items`)
  .join('\n')}

## 🏷️ Content by Theme

${Object.entries(themeCounts)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 20)
  .map(([theme, count]) => `- **${theme}**: ${count} items`)
  .join('\n')}

## #️⃣ Top Hashtags

${topHashtags.slice(0, 30).map(([hashtag, count]) => `- **${hashtag}**: ${count} uses`).join('\n')}

## 💪 Strongest Captions

${strongCaptions.map((caption, index) => `${index + 1}. "${caption}"`).join('\n\n')}

## 🎭 Content Clusters

${Object.entries(contentClusters)
  .sort(([,a], [,b]) => b.length - a.length)
  .map(([cluster, items]) => `### ${cluster} (${items.length} items)
${items.slice(0, 5).map(item => `- "${item.caption?.slice(0, 100)}..."`).join('\n')}`)
  .join('\n\n')}

## 🛍️ Suggested Shopify Collections

${shopifyCollections.map(collection => `- **${collection.title}**: ${collection.description}`).join('\n')}

## 💡 Product Ideas

${productIdeas.map(idea => `- **${idea.title}**: ${idea.description}`).join('\n')}

## 🏠 Homepage Copy Snippets

${homepageCopy.map(snippet => `> "${snippet}"`).join('\n\n')}
`;

  fs.writeFileSync(mdPath, markdown, 'utf-8');
  console.log(`📝 Markdown summary exported`);
}

function getTypeCounts(content) {
  return content.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});
}

function getThemeCounts(content) {
  return content.reduce((acc, item) => {
    (item.themes || []).forEach(theme => {
      acc[theme] = (acc[theme] || 0) + 1;
    });
    return acc;
  }, {});
}

function getTopHashtags(content) {
  const hashtagCounts = content.reduce((acc, item) => {
    (item.hashtags || []).forEach(hashtag => {
      acc[hashtag] = (acc[hashtag] || 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(hashtagCounts)
    .sort(([,a], [,b]) => b - a);
}

function getStrongCaptions(content) {
  return content
    .filter(item => item.caption && item.caption.length > 20)
    .sort((a, b) => (b.caption?.length || 0) - (a.caption?.length || 0))
    .slice(0, 25)
    .map(item => item.caption);
}

function getContentClusters(content) {
  const clusters = {};

  content.forEach(item => {
    const primaryTheme = (item.themes || [])[0] || 'unclassified';
    if (!clusters[primaryTheme]) {
      clusters[primaryTheme] = [];
    }
    clusters[primaryTheme].push(item);
  });

  return clusters;
}

function suggestShopifyCollections(content) {
  const themeCounts = getThemeCounts(content);
  const topThemes = Object.entries(themeCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  return topThemes.map(([theme, count]) => ({
    title: theme.charAt(0).toUpperCase() + theme.slice(1),
    description: `${count} pieces of content about ${theme}`
  }));
}

function suggestProductIdeas(content) {
  const themes = Object.keys(getThemeCounts(content));
  const ideas = [];

  // Generate product ideas based on themes
  themes.slice(0, 10).forEach(theme => {
    ideas.push({
      title: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Collection`,
      description: `Curated products inspired by ${theme} content`
    });
  });

  return ideas.slice(0, 15);
}

function generateHomepageCopy(content) {
  const captions = content
    .filter(item => item.caption && item.caption.length > 50)
    .map(item => item.caption)
    .slice(0, 10);

  return captions;
}

// Run the export
exportInstagramData();