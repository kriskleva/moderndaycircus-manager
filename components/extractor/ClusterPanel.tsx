import { NormalizedContent } from '../../lib/schemas/content';
import { ThemeBadge } from './ThemeBadge';

interface ClusterPanelProps {
  themes: string[];
  content: NormalizedContent[];
  onViewAll?: () => void;
}

export function ClusterPanel({ themes, content, onViewAll }: ClusterPanelProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          {themes.join(' + ')}
        </h3>
        <p className="text-sm text-gray-600">
          {content.length} items
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {themes.map(theme => (
          <ThemeBadge key={theme} theme={theme as any} size="sm" />
        ))}
      </div>

      <div className="space-y-2 mb-4">
        {content.slice(0, 3).map((item, index) => (
          <div key={index} className="rounded bg-gray-50 p-3">
            <p className="text-sm text-gray-700">
              {item.summary || item.caption || 'No content'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {item.createdAt.toLocaleDateString()}
            </p>
          </div>
        ))}
        {content.length > 3 && (
          <p className="text-sm text-gray-500">
            ... and {content.length - 3} more items
          </p>
        )}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-sm text-purple-600 hover:underline"
        >
          View all in cluster →
        </button>
      )}
    </div>
  );
}