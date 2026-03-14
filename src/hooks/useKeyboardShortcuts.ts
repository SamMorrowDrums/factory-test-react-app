import { useState, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  description: string;
  category: 'general' | 'navigation' | 'actions' | 'filters';
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: '?', description: 'Show keyboard shortcuts', category: 'general' },
  { key: 'n / /', description: 'Focus new todo input', category: 'general' },
  { key: 'Escape', description: 'Clear focus / close dialog', category: 'general' },
  { key: '⌘Z / Ctrl+Z', description: 'Undo', category: 'general' },
  { key: '⌘⇧Z / Ctrl+Y', description: 'Redo', category: 'general' },
  { key: 'j / ↓', description: 'Next todo', category: 'navigation' },
  { key: 'k / ↑', description: 'Previous todo', category: 'navigation' },
  { key: 'x', description: 'Toggle todo completion', category: 'actions' },
  { key: 'Delete', description: 'Delete todo', category: 'actions' },
  { key: '1', description: 'Show all todos', category: 'filters' },
  { key: '2', description: 'Show active todos', category: 'filters' },
  { key: '3', description: 'Show completed todos', category: 'filters' },
];

export function useKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = useCallback(() => setShowHelp((prev) => !prev), []);
  const closeHelp = useCallback(() => setShowHelp(false), []);

  return { showHelp, toggleHelp, closeHelp, shortcuts: KEYBOARD_SHORTCUTS };
}
