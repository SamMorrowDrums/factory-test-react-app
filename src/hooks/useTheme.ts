import { useLocalStorage } from './useLocalStorage';
import { useEffect } from 'react';

export type Theme = 'cyberpunk' | 'clean';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('glitchdo-theme', 'cyberpunk');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'cyberpunk' ? 'clean' : 'cyberpunk'));
  };

  return { theme, toggleTheme } as const;
}
