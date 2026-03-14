import { memo } from 'react';
import type { Theme } from '../hooks/useTheme';
import './ThemeToggle.css';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export const ThemeToggle = memo(function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isCyberpunk = theme === 'cyberpunk';

  return (
    <button
      className={`theme-toggle ${isCyberpunk ? 'theme-toggle--cyberpunk' : 'theme-toggle--clean'}`}
      onClick={onToggle}
      aria-label={`Switch to ${isCyberpunk ? 'clean' : 'cyberpunk'} theme`}
      title={`Switch to ${isCyberpunk ? 'Clean' : 'Cyberpunk'} mode`}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isCyberpunk ? '☀️' : '⚡'}
      </span>
      <span className="theme-toggle__label">
        {isCyberpunk ? 'Clean' : 'Cyber'}
      </span>
    </button>
  );
});
