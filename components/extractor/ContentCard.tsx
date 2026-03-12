import { NormalizedContent } from '../../lib/schemas/content';

interface ContentCardProps {
  content: NormalizedContent;
  onClick?: () => void;
}

export function ContentCard({ content, onClick }: ContentCardProps) {
  return (
    <div
      className="rounded-lg border bg-white p-4 shadow cursor-pointer hover:shadow-md transition"
      onClick={onClick}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded bg-gray-100 px-2 py-1 text-sm capitalize">
          {content.type}
        </span>
        <span className="text-sm text-gray-500">
          {content.createdAt.toLocaleDateString()}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-700">
          {content.summary || content.caption || 'No content'}
        </p>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {content.themes.map(theme => (
          <span
            key={theme}
            className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800"
          >
            {theme}
          </span>
        ))}
      </div>

      <div className="text-xs text-gray-500">
        <p>Source: {content.sourceFile}</p>
        {content.hashtags.length > 0 && (
          <p>Tags: {content.hashtags.slice(0, 3).join(', ')}</p>
        )}
      </div>
    </div>
  );
}