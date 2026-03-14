import { type Theme } from '../hooks/useTheme';
import './ThemeToggle.css';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'cyberpunk' ? 'clean' : 'cyberpunk'} theme`}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {theme === 'cyberpunk' ? '⚡' : '✨'}
      </span>
      <span className="theme-toggle__label">
        {theme === 'cyberpunk' ? 'CYBER' : 'Clean'}
      </span>
    </button>
  );
}
