import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from './useTodos';

describe('useTodos', () => {
  it('starts with an empty todo list', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
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
  });

  it('toggles a todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Exercise', 'health');
    });

    const id = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(id);
    });

    expect(result.current.todos[0].completed).toBe(true);

    act(() => {
      result.current.toggleTodo(id);
    });

    expect(result.current.todos[0].completed).toBe(false);
  });

  it('deletes a todo', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task 1', 'work');
      result.current.addTodo('Task 2', 'personal');
    });

    const id = result.current.todos[0].id;

    act(() => {
      result.current.deleteTodo(id);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Task 2');
  });

  it('clears completed todos', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Done task', 'work');
      result.current.addTodo('Active task', 'work');
    });

    const doneId = result.current.todos[0].id;

    act(() => {
      result.current.toggleTodo(doneId);
    });

    act(() => {
      result.current.clearCompleted();
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].title).toBe('Active task');
  });

  it('does not mutate state when toggling a non-existent id', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('Task', 'work');
    });

    act(() => {
      result.current.toggleTodo('non-existent');
    });

    expect(result.current.todos).toHaveLength(1);
  });
});
