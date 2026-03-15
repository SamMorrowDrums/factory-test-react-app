import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type Theme = 'cyberpunk' | 'clean';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('glitchdo-theme', 'cyberpunk');

  useEffect(() => {
    if (theme === 'clean') {
      document.documentElement.setAttribute('data-theme', 'clean');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'cyberpunk' ? 'clean' : 'cyberpunk'));
  }, [setTheme]);

  return { theme, toggleTheme };
}
