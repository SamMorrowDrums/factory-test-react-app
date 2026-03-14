import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to cyberpunk theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('cyberpunk');
  });

  it('sets data-theme attribute on document element', () => {
    renderHook(() => useTheme());
    expect(document.documentElement.getAttribute('data-theme')).toBe('cyberpunk');
  });

  it('toggles from cyberpunk to clean', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('clean');
    expect(document.documentElement.getAttribute('data-theme')).toBe('clean');
  });

  it('toggles back to cyberpunk from clean', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });
    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('cyberpunk');
  });

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(JSON.parse(localStorage.getItem('glitchdo-theme')!)).toBe('clean');
  });

  it('restores theme from localStorage', () => {
    localStorage.setItem('glitchdo-theme', JSON.stringify('clean'));

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('clean');
  });
});
