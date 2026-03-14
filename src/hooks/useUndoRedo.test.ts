import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useUndoRedo } from './useUndoRedo';

describe('useUndoRedo', () => {
  it('starts with empty stacks', () => {
    const { result } = renderHook(() => useUndoRedo<number[]>());
    expect(result.current.canUndo()).toBe(false);
    expect(result.current.canRedo()).toBe(false);
  });

  it('can undo after pushing a snapshot', () => {
    const { result } = renderHook(() => useUndoRedo<number[]>());

    act(() => {
      result.current.pushUndo([1, 2]);
    });

    expect(result.current.canUndo()).toBe(true);

    let restored: number[] | undefined;
    act(() => {
      restored = result.current.undo([1, 2, 3]);
    });

    expect(restored).toEqual([1, 2]);
    expect(result.current.canUndo()).toBe(false);
    expect(result.current.canRedo()).toBe(true);
  });

  it('can redo after an undo', () => {
    const { result } = renderHook(() => useUndoRedo<number[]>());

    act(() => {
      result.current.pushUndo([1]);
    });

    act(() => {
      result.current.undo([1, 2]);
    });

    let restored: number[] | undefined;
    act(() => {
      restored = result.current.redo([1]);
    });

    expect(restored).toEqual([1, 2]);
    expect(result.current.canRedo()).toBe(false);
    expect(result.current.canUndo()).toBe(true);
  });

  it('clears redo stack when a new mutation is pushed', () => {
    const { result } = renderHook(() => useUndoRedo<number[]>());

    act(() => {
      result.current.pushUndo([1]);
    });
    act(() => {
      result.current.undo([1, 2]);
    });

    expect(result.current.canRedo()).toBe(true);

    act(() => {
      result.current.pushUndo([1, 3]);
    });

    expect(result.current.canRedo()).toBe(false);
  });

  it('returns undefined when undo stack is empty', () => {
    const { result } = renderHook(() => useUndoRedo<string>());

    let val: string | undefined;
    act(() => {
      val = result.current.undo('current');
    });

    expect(val).toBeUndefined();
  });

  it('returns undefined when redo stack is empty', () => {
    const { result } = renderHook(() => useUndoRedo<string>());

    let val: string | undefined;
    act(() => {
      val = result.current.redo('current');
    });

    expect(val).toBeUndefined();
  });

  it('supports multiple levels of undo', () => {
    const { result } = renderHook(() => useUndoRedo<number>());

    act(() => result.current.pushUndo(1));
    act(() => result.current.pushUndo(2));
    act(() => result.current.pushUndo(3));

    let val: number | undefined;
    act(() => { val = result.current.undo(4); });
    expect(val).toBe(3);

    act(() => { val = result.current.undo(3); });
    expect(val).toBe(2);

    act(() => { val = result.current.undo(2); });
    expect(val).toBe(1);

    expect(result.current.canUndo()).toBe(false);
  });
});
