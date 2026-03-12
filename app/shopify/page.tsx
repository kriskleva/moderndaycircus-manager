'use client';

import { useState, useEffect } from 'react';
import { ProductIdea, ShopifyCopy } from '../../lib/schemas/shopify';

interface ShopifyResponse {
  success: boolean;
  assets: {
    productIdeas: ProductIdea[];
    collectionIdeas: any[];
    tags: string[];
    copy: ShopifyCopy;
  };
  error?: string;
}

export default function ShopifyPage() {
  const [assets, setAssets] = useState<ShopifyResponse['assets'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const response = await fetch('/api/generate-shopify-assets');
      const result: ShopifyResponse = await response.json();
      if (result.success) {
        setAssets(result.assets);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
          <p>Generating Shopify assets...</p>
        </div>
      </div>
    );
  }

  if (!assets) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Failed to generate assets. Try importing content first.</p>
        <a href="/import" className="text-purple-600 hover:underline">
          Go to Import →
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Shopify Assets</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Ideas */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Product Ideas</h2>
          <div className="space-y-4">
            {assets.productIdeas.map((idea, index) => (
              <div key={index} className="rounded-lg border bg-white p-4 shadow">
                <h3 className="font-semibold">{idea.title}</h3>
                <p className="text-sm text-gray-700 mt-2">{idea.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {idea.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {idea.price && (
                  <p className="mt-2 text-sm font-medium">${idea.price}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Shopify Tags</h2>
          <div className="rounded-lg border bg-white p-4 shadow">
            <div className="flex flex-wrap gap-2">
              {assets.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded bg-green-100 px-3 py-1 text-sm text-green-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copy Snippets */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Copy Snippets</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-white p-4 shadow">
            <h3 className="font-semibold mb-2">Homepage</h3>
            <p className="text-sm text-gray-700">{assets.copy.homepageSnippet}</p>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow">
            <h3 className="font-semibold mb-2">About Page</h3>
            <p className="text-sm text-gray-700">{assets.copy.aboutSnippet}</p>
          </div>

          <div className="rounded-lg border bg-white p-4 shadow">
            <h3 className="font-semibold mb-2">Brand Story</h3>
            <p className="text-sm text-gray-700">{assets.copy.brandStorySnippet}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Product Descriptions</h3>
          <div className="space-y-2">
            {assets.copy.productDescriptions.map((desc, index) => (
              <div key={index} className="rounded bg-gray-50 p-3">
                <p className="text-sm text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}