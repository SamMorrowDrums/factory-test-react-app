import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('theme-clean');
  });

  it('defaults to cyberpunk theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('cyberpunk');
  });

  it('toggles to clean theme', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('clean');
  });

  it('toggles back to cyberpunk', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('cyberpunk');
  });

  it('adds theme-clean class to documentElement when clean', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    expect(document.documentElement.classList.contains('theme-clean')).toBe(true);
  });

  it('removes theme-clean class when switching back to cyberpunk', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggleTheme());
    act(() => result.current.toggleTheme());
    expect(document.documentElement.classList.contains('theme-clean')).toBe(false);
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
  });
});
