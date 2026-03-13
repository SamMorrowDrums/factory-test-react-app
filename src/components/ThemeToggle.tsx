import { useTheme } from '../hooks/useTheme';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'cyberpunk' ? 'light' : 'cyberpunk'} theme`}
      title={`Switch to ${theme === 'cyberpunk' ? 'light' : 'cyberpunk'} theme`}
    >
      {theme === 'cyberpunk' ? '☀️' : '🌙'}
    </button>
  );
}
