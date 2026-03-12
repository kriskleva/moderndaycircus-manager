import { ProductIdea } from '../../lib/schemas/shopify';

interface ProductIdeaCardProps {
  idea: ProductIdea;
  onCopy?: (text: string) => void;
}

export function ProductIdeaCard({ idea, onCopy }: ProductIdeaCardProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    onCopy?.(text);
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-semibold">{idea.title}</h3>
        <button
          onClick={() => handleCopy(idea.title)}
          className="ml-2 text-xs text-gray-400 hover:text-gray-600"
          title="Copy title"
        >
          📋
        </button>
      </div>

      <p className="text-sm text-gray-700 mb-3">{idea.description}</p>

      <div className="mb-3 flex flex-wrap gap-1">
        {idea.tags.map(tag => (
          <span
            key={tag}
            className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 cursor-pointer"
            onClick={() => handleCopy(tag)}
            title="Click to copy tag"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        {idea.price && (
          <p className="text-sm font-medium">${idea.price}</p>
        )}
        {idea.category && (
          <span className="text-xs text-gray-500">{idea.category}</span>
        )}
        <button
          onClick={() => handleCopy(`${idea.title}\n\n${idea.description}\n\nTags: ${idea.tags.join(', ')}`)}
          className="text-xs text-purple-600 hover:underline"
        >
          Copy all
        </button>
      </div>
    </div>
  );
}