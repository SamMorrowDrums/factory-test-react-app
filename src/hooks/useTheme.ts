import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type Theme = 'cyberpunk' | 'clean';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('glitchdo-theme', 'cyberpunk');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'clean') {
      root.classList.add('theme-clean');
    } else {
      root.classList.remove('theme-clean');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'cyberpunk' ? 'clean' : 'cyberpunk'));
  };

  return { theme, toggleTheme } as const;
}
