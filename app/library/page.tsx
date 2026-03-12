'use client';

import { useState, useEffect } from 'react';
import { NormalizedContent } from '../../lib/schemas/content';

interface ContentResponse {
  success: boolean;
  content: NormalizedContent[];
  totalItems: number;
  error?: string;
}

export default function LibraryPage() {
  const [content, setContent] = useState<NormalizedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/classify-content');
      const result: ContentResponse = await response.json();
      if (result.success) {
        setContent(result.content);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = content.filter(item => {
    const themeMatch = filter === 'all' || item.themes.includes(filter as any);
    const typeMatch = typeFilter === 'all' || item.type === typeFilter;
    return themeMatch && typeMatch;
  });

  const uniqueThemes = Array.from(new Set(content.flatMap(c => c.themes)));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Content Library</h1>

      <div className="mb-6 flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="all">All Themes</option>
          {uniqueThemes.map(theme => (
            <option key={theme} value={theme}>{theme}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="all">All Types</option>
          <option value="post">Posts</option>
          <option value="reel">Reels</option>
          <option value="story">Stories</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <div className="mb-4 text-gray-600">
        Showing {filteredContent.length} of {content.length} items
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContent.map((item) => (
          <div key={item.id} className="rounded-lg border bg-white p-4 shadow">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-gray-100 px-2 py-1 text-sm capitalize">
                {item.type}
              </span>
              <span className="text-sm text-gray-500">
                {item.createdAt.toLocaleDateString()}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-700">
                {item.summary || item.caption || 'No content'}
              </p>
            </div>

            <div className="mb-3 flex flex-wrap gap-1">
              {item.themes.map(theme => (
                <span
                  key={theme}
                  className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800"
                >
                  {theme}
                </span>
              ))}
            </div>

            <div className="text-xs text-gray-500">
              <p>Source: {item.sourceFile}</p>
              {item.hashtags.length > 0 && (
                <p>Tags: {item.hashtags.slice(0, 3).join(', ')}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && content.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No content matches the current filters.</p>
        </div>
      )}

      {content.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No content found. Try importing first.</p>
          <a href="/import" className="text-purple-600 hover:underline">
            Go to Import →
          </a>
        </div>
      )}
    </div>
  );
}