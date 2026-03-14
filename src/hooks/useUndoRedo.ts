import { useCallback, useRef } from 'react';

export interface UndoRedoActions<T> {
  /** Record a snapshot before a mutation so it can be reverted. */
  pushUndo: (snapshot: T) => void;
  /** Revert to the previous snapshot, pushing the current state onto the redo stack. */
  undo: (currentState: T) => T | undefined;
  /** Re-apply the last undone state, pushing the current state onto the undo stack. */
  redo: (currentState: T) => T | undefined;
  /** Whether undo is available. */
  canUndo: () => boolean;
  /** Whether redo is available. */
  canRedo: () => boolean;
}

const MAX_HISTORY = 50;

/**
 * A generic undo/redo hook backed by two stacks.
 * State is stored externally — this hook only manages the history stacks.
 */
export function useUndoRedo<T>(): UndoRedoActions<T> {
  const undoStack = useRef<T[]>([]);
  const redoStack = useRef<T[]>([]);

  const pushUndo = useCallback((snapshot: T) => {
    undoStack.current = [...undoStack.current.slice(-(MAX_HISTORY - 1)), snapshot];
    // Any new mutation clears the redo stack
    redoStack.current = [];
  }, []);

  const undo = useCallback((currentState: T): T | undefined => {
    if (undoStack.current.length === 0) return undefined;
    const previous = undoStack.current[undoStack.current.length - 1];
    undoStack.current = undoStack.current.slice(0, -1);
    redoStack.current = [...redoStack.current, currentState];
    return previous;
  }, []);

  const redo = useCallback((currentState: T): T | undefined => {
    if (redoStack.current.length === 0) return undefined;
    const next = redoStack.current[redoStack.current.length - 1];
    redoStack.current = redoStack.current.slice(0, -1);
    undoStack.current = [...undoStack.current, currentState];
    return next;
  }, []);

  const canUndo = useCallback(() => undoStack.current.length > 0, []);
  const canRedo = useCallback(() => redoStack.current.length > 0, []);

  return { pushUndo, undo, redo, canUndo, canRedo };
}
