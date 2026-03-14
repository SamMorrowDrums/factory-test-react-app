import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useTodos } from './useTodos';
import { Todo } from '../types/todo';

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty todo list by default', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('starts with provided initial todos', () => {
    const initial: Todo[] = [
      { id: '1', title: 'Test', completed: false, category: 'work', createdAt: 1 },
    ];
    const { result } = renderHook(() => useTodos(initial));
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Test');
  });

  it('adds a todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Buy milk', 'shopping');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Buy milk');
    expect(result.current.todos[0].category).toBe('shopping');
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[0].id).toBeDefined();
    expect(result.current.todos[0].createdAt).toBeDefined();
  });

  it('toggles a todo', () => {
    const initial: Todo[] = [
      { id: '1', title: 'Test', completed: false, category: 'work', createdAt: 1 },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.toggleTodo('1');
    });

    expect(result.current.todos[0].completed).toBe(true);

    act(() => {
      result.current.toggleTodo('1');
    });

    expect(result.current.todos[0].completed).toBe(false);
  });

  it('deletes a todo', () => {
    const initial: Todo[] = [
      { id: '1', title: 'First', completed: false, category: 'work', createdAt: 1 },
      { id: '2', title: 'Second', completed: false, category: 'personal', createdAt: 2 },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.deleteTodo('1');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].id).toBe('2');
  });

  it('clears completed todos', () => {
    const initial: Todo[] = [
      { id: '1', title: 'Done', completed: true, category: 'work', createdAt: 1 },
      { id: '2', title: 'Not done', completed: false, category: 'personal', createdAt: 2 },
      { id: '3', title: 'Also done', completed: true, category: 'health', createdAt: 3 },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.clearCompleted();
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].id).toBe('2');
  });

  it('persists todos to localStorage', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Persisted', 'work');
    });

    const stored = JSON.parse(localStorage.getItem('todos')!) as Todo[];
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('Persisted');
  });

  it('loads todos from localStorage on mount', () => {
    const saved: Todo[] = [
      { id: '1', title: 'Saved', completed: false, category: 'work', createdAt: 1 },
    ];
    localStorage.setItem('todos', JSON.stringify(saved));

    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Saved');
  });

  it('falls back to empty array on corrupt localStorage data', () => {
    localStorage.setItem('todos', 'not-json');
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
  });

  it('reorders todos by moving dragged item to target position', () => {
    const initial: Todo[] = [
      { id: '1', title: 'First', completed: false, category: 'work', createdAt: 1 },
      { id: '2', title: 'Second', completed: false, category: 'personal', createdAt: 2 },
      { id: '3', title: 'Third', completed: false, category: 'health', createdAt: 3 },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.reorderTodos('3', '1');
    });

    expect(result.current.todos.map((t) => t.id)).toEqual(['3', '1', '2']);
  });

  it('does not reorder when dragged and target are the same', () => {
    const initial: Todo[] = [
      { id: '1', title: 'First', completed: false, category: 'work', createdAt: 1 },
      { id: '2', title: 'Second', completed: false, category: 'personal', createdAt: 2 },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.reorderTodos('1', '1');
    });

    expect(result.current.todos.map((t) => t.id)).toEqual(['1', '2']);
  });

  it('does not reorder when dragged id is invalid', () => {
    const initial: Todo[] = [
      { id: '1', title: 'First', completed: false, category: 'work', createdAt: 1 },
      { id: '2', title: 'Second', completed: false, category: 'personal', createdAt: 2 },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.reorderTodos('nonexistent', '1');
    });

    expect(result.current.todos.map((t) => t.id)).toEqual(['1', '2']);
  });

  it('reorders by moving an item forward', () => {
    const initial: Todo[] = [
      { id: '1', title: 'First', completed: false, category: 'work', createdAt: 1 },
      { id: '2', title: 'Second', completed: false, category: 'personal', createdAt: 2 },
      { id: '3', title: 'Third', completed: false, category: 'health', createdAt: 3 },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.reorderTodos('1', '3');
    });

    expect(result.current.todos.map((t) => t.id)).toEqual(['2', '1', '3']);
  });

  it('adds a todo with notes', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task with notes', 'work', 'Some detailed notes');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].notes).toBe('Some detailed notes');
  });

  it('adds a todo without notes when notes are undefined', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task without notes', 'work');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].notes).toBeUndefined();
  });

  it('updates notes on a todo', () => {
    const initial: Todo[] = [
      { id: '1', title: 'Test', completed: false, category: 'work', createdAt: 1 },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.updateNotes('1', 'New notes');
    });

    expect(result.current.todos[0].notes).toBe('New notes');
  });

  it('removes notes when setting empty string', () => {
    const initial: Todo[] = [
      { id: '1', title: 'Test', completed: false, category: 'work', createdAt: 1, notes: 'Old notes' },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.updateNotes('1', '');
    });

    expect(result.current.todos[0].notes).toBeUndefined();
  });
});
