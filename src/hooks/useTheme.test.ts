import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('defaults to cyberpunk theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('cyberpunk');
  });

  it('does not set data-theme attribute for cyberpunk', () => {
    renderHook(() => useTheme());
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('toggles to clean theme', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('clean');
    expect(document.documentElement.getAttribute('data-theme')).toBe('clean');
  });

  it('toggles back to cyberpunk', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('cyberpunk');
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(JSON.parse(localStorage.getItem('glitchdo-theme')!)).toBe('clean');
  });

  it('restores theme from localStorage', () => {
    localStorage.setItem('glitchdo-theme', JSON.stringify('clean'));
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('clean');
    expect(document.documentElement.getAttribute('data-theme')).toBe('clean');
  });
});
