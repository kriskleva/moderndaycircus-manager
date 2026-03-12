'use client';

import { useState, useEffect } from 'react';
import { NormalizedContent } from '../../lib/schemas/content';

interface ContentResponse {
  success: boolean;
  content: NormalizedContent[];
  totalItems: number;
  error?: string;
}

interface Cluster {
  themes: string[];
  content: NormalizedContent[];
  count: number;
}

export default function ClustersPage() {
  const [content, setContent] = useState<NormalizedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [clusters, setClusters] = useState<Cluster[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (content.length > 0) {
      generateClusters();
    }
  }, [content]);

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

  const generateClusters = () => {
    const clusterMap = new Map<string, Cluster>();

    content.forEach(item => {
      // Create clusters based on theme combinations
      const sortedThemes = [...item.themes].sort();
      const clusterKey = sortedThemes.join('+');

      if (!clusterMap.has(clusterKey)) {
        clusterMap.set(clusterKey, {
          themes: sortedThemes,
          content: [],
          count: 0,
        });
      }

      const cluster = clusterMap.get(clusterKey)!;
      cluster.content.push(item);
      cluster.count++;
    });

    const sortedClusters = Array.from(clusterMap.values())
      .sort((a, b) => b.count - a.count);

    setClusters(sortedClusters);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p>Loading clusters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Content Clusters</h1>

      <div className="mb-6">
        <p className="text-gray-600">
          Content grouped by theme combinations. Each cluster represents overlapping themes in your content.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {clusters.map((cluster, index) => (
          <div key={index} className="rounded-lg border bg-white p-6 shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                {cluster.themes.join(' + ')}
              </h3>
              <p className="text-sm text-gray-600">
                {cluster.count} items
              </p>
            </div>

            <div className="mb-4 flex flex-wrap gap-1">
              {cluster.themes.map(theme => (
                <span
                  key={theme}
                  className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800"
                >
                  {theme}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              {cluster.content.slice(0, 3).map((item, itemIndex) => (
                <div key={itemIndex} className="rounded bg-gray-50 p-3">
                  <p className="text-sm text-gray-700">
                    {item.summary || item.caption || 'No content'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
              {cluster.content.length > 3 && (
                <p className="text-sm text-gray-500">
                  ... and {cluster.content.length - 3} more items
                </p>
              )}
            </div>

            <div className="mt-4">
              <button className="text-sm text-purple-600 hover:underline">
                View all in cluster →
              </button>
            </div>
          </div>
        ))}
      </div>

      {clusters.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No clusters found. Try importing content first.</p>
          <a href="/import" className="text-purple-600 hover:underline">
            Go to Import →
          </a>
        </div>
      )}
    </div>
  );
}