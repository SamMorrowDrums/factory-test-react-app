import { memo } from 'react';
import type { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export const ThemeToggle = memo(function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'cyberpunk' ? 'clean' : 'cyberpunk'} theme`}
      title={`Switch to ${theme === 'cyberpunk' ? 'clean' : 'cyberpunk'} theme`}
    >
      {theme === 'cyberpunk' ? '☀️' : '🌙'}
    </button>
  );
});
