import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts, KEYBOARD_SHORTCUTS } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  it('returns the shortcuts list', () => {
    const { result } = renderHook(() => useKeyboardShortcuts());
    expect(result.current.shortcuts).toBe(KEYBOARD_SHORTCUTS);
    expect(result.current.shortcuts.length).toBeGreaterThan(0);
  });

  it('starts with help closed', () => {
    const { result } = renderHook(() => useKeyboardShortcuts());
    expect(result.current.showHelp).toBe(false);
  });

  it('toggles help visibility', () => {
    const { result } = renderHook(() => useKeyboardShortcuts());
    act(() => result.current.toggleHelp());
    expect(result.current.showHelp).toBe(true);
    act(() => result.current.toggleHelp());
    expect(result.current.showHelp).toBe(false);
  });

  it('closes help', () => {
    const { result } = renderHook(() => useKeyboardShortcuts());
    act(() => result.current.toggleHelp());
    expect(result.current.showHelp).toBe(true);
    act(() => result.current.closeHelp());
    expect(result.current.showHelp).toBe(false);
  });

  it('includes shortcuts for all categories', () => {
    const categories = new Set(KEYBOARD_SHORTCUTS.map((s) => s.category));
    expect(categories).toContain('general');
    expect(categories).toContain('navigation');
    expect(categories).toContain('actions');
    expect(categories).toContain('filters');
  });
});
