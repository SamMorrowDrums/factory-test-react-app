import { useCallback } from 'react';
import { Todo, TodoCategory, createTodo } from '../types/todo';
import { useLocalStorage } from './useLocalStorage';
import { useUndoRedo } from './useUndoRedo';

export interface TodoUndoRedoInfo {
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => string | undefined;
  redo: () => string | undefined;
}

export function useTodos(initialTodos: Todo[] = []) {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', initialTodos);
  const { pushUndo, undo: undoStack, redo: redoStack, canUndo, canRedo } = useUndoRedo<Todo[]>();

  /** Helper: snapshot current state then apply a mutation. */
  const mutate = useCallback(
    (updater: (prev: Todo[]) => Todo[]) => {
      setTodos((prev) => {
        pushUndo(prev);
        return updater(prev);
      });
    },
    [setTodos, pushUndo],
  );

  const addTodo = useCallback((title: string, category: TodoCategory) => {
    mutate((prev) => [...prev, createTodo(title, category)]);
  }, [mutate]);

  const toggleTodo = useCallback((id: string) => {
    mutate((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, [mutate]);

  const deleteTodo = useCallback((id: string) => {
    mutate((prev) => prev.filter((todo) => todo.id !== id));
  }, [mutate]);

  const clearCompleted = useCallback(() => {
    mutate((prev) => prev.filter((todo) => !todo.completed));
  }, [mutate]);

  const importTodos = useCallback((imported: Todo[]) => {
    mutate(() => imported);
  }, [mutate]);

  const reorderTodos = useCallback((draggedId: string, targetId: string) => {
    if (draggedId === targetId) return;
    mutate((prev) => {
      const draggedIndex = prev.findIndex((t) => t.id === draggedId);
      const targetIndex = prev.findIndex((t) => t.id === targetId);
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const next = [...prev];
      const [dragged] = next.splice(draggedIndex, 1);
      const newTargetIndex = next.findIndex((t) => t.id === targetId);
      next.splice(newTargetIndex, 0, dragged);
      return next;
    });
  }, [mutate]);

  const undo = useCallback((): string | undefined => {
    let description: string | undefined;
    setTodos((current) => {
      const previous = undoStack(current);
      if (previous === undefined) return current;
      description = 'Undo';
      return previous;
    });
    return description;
  }, [setTodos, undoStack]);

  const redo = useCallback((): string | undefined => {
    let description: string | undefined;
    setTodos((current) => {
      const next = redoStack(current);
      if (next === undefined) return current;
      description = 'Redo';
      return next;
    });
    return description;
  }, [setTodos, redoStack]);

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    reorderTodos,
    importTodos,
    undo,
    redo,
    canUndo,
    canRedo,
  } as const;
}
