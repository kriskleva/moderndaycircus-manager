import { NormalizedContent } from '../../lib/schemas/content';

interface ContentTableProps {
  content: NormalizedContent[];
  onSelect?: (item: NormalizedContent) => void;
}

export function ContentTable({ content, onSelect }: ContentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Summary</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Themes</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Hashtags</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Source</th>
          </tr>
        </thead>
        <tbody>
          {content.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect?.(item)}
            >
              <td className="border border-gray-300 px-4 py-2 capitalize">
                {item.type}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.createdAt.toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2 max-w-xs truncate">
                {item.summary || item.caption || 'No content'}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <div className="flex flex-wrap gap-1">
                  {item.themes.map(theme => (
                    <span
                      key={theme}
                      className="rounded bg-purple-100 px-2 py-1 text-xs text-purple-800"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {item.hashtags.slice(0, 2).join(', ')}
                {item.hashtags.length > 2 && '...'}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm text-gray-500">
                {item.sourceFile}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}