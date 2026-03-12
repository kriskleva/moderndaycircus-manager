import { Theme } from '../../lib/schemas/content';

interface ThemeBadgeProps {
  theme: Theme;
  confidence?: number;
  size?: 'sm' | 'md';
}

export function ThemeBadge({ theme, confidence, size = 'md' }: ThemeBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`rounded-full bg-purple-100 text-purple-800 ${sizeClasses[size]}`}
      title={confidence ? `Confidence: ${(confidence * 100).toFixed(0)}%` : undefined}
    >
      {theme}
      {confidence && confidence < 1 && (
        <span className="ml-1 opacity-75">
          ({(confidence * 100).toFixed(0)}%)
        </span>
      )}
    </span>
  );
}