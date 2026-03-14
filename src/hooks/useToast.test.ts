import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useToast } from './useToast';

describe('useToast', () => {
  it('starts with no toasts', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  it('adds a toast via showToast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('Hello');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Hello');
  });

  it('dismisses a toast by id', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast('First');
      result.current.showToast('Second');
    });

    const idToRemove = result.current.toasts[0].id;

    act(() => {
      result.current.dismissToast(idToRemove);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Second');
  });
});
