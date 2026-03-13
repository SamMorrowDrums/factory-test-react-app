import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useTodos } from './useTodos';
import { Todo } from '../types/todo';

describe('useTodos', () => {
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
});
