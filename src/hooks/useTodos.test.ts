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

  it('adds a sub-task with parentId', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Parent', 'work');
    });

    const parentId = result.current.todos[0].id;

    act(() => {
      result.current.addTodo('Child', 'work', parentId);
    });

    expect(result.current.todos).toHaveLength(2);
    expect(result.current.todos[1].title).toBe('Child');
    expect(result.current.todos[1].parentId).toBe(parentId);
  });

  it('cascades toggle to sub-tasks', () => {
    const initial: Todo[] = [
      { id: 'p1', title: 'Parent', completed: false, category: 'work', createdAt: 1 },
      { id: 'c1', title: 'Child 1', completed: false, category: 'work', createdAt: 2, parentId: 'p1' },
      { id: 'c2', title: 'Child 2', completed: false, category: 'work', createdAt: 3, parentId: 'p1' },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.toggleTodo('p1');
    });

    expect(result.current.todos[0].completed).toBe(true);
    expect(result.current.todos[1].completed).toBe(true);
    expect(result.current.todos[2].completed).toBe(true);
  });

  it('cascades delete to sub-tasks', () => {
    const initial: Todo[] = [
      { id: 'p1', title: 'Parent', completed: false, category: 'work', createdAt: 1 },
      { id: 'c1', title: 'Child', completed: false, category: 'work', createdAt: 2, parentId: 'p1' },
      { id: 'other', title: 'Other', completed: false, category: 'personal', createdAt: 3 },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.deleteTodo('p1');
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].id).toBe('other');
  });

  it('toggles a sub-task independently', () => {
    const initial: Todo[] = [
      { id: 'p1', title: 'Parent', completed: false, category: 'work', createdAt: 1 },
      { id: 'c1', title: 'Child', completed: false, category: 'work', createdAt: 2, parentId: 'p1' },
    ];
    const { result } = renderHook(() => useTodos(initial));

    act(() => {
      result.current.toggleTodo('c1');
    });

    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[1].completed).toBe(true);
  });
});
