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
      { id: '1', title: 'Test', completed: false, category: 'work', priority: 'medium', dueDate: null, createdAt: 1 },
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
    expect(result.current.todos[0].priority).toBe('medium');
    expect(result.current.todos[0].dueDate).toBeNull();
    expect(result.current.todos[0].completed).toBe(false);
    expect(result.current.todos[0].id).toBeDefined();
    expect(result.current.todos[0].createdAt).toBeDefined();
  });

  it('adds a todo with priority and due date', () => {
    const { result } = renderHook(() => useTodos());
    const dueDate = new Date('2026-12-31').getTime();

    act(() => {
      result.current.addTodo('Urgent task', 'work', 'high', dueDate);
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].priority).toBe('high');
    expect(result.current.todos[0].dueDate).toBe(dueDate);
  });

  it('toggles a todo', () => {
    const initial: Todo[] = [
      { id: '1', title: 'Test', completed: false, category: 'work', priority: 'medium', dueDate: null, createdAt: 1 },
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
      { id: '1', title: 'First', completed: false, category: 'work', priority: 'medium', dueDate: null, createdAt: 1 },
      { id: '2', title: 'Second', completed: false, category: 'personal', priority: 'high', dueDate: null, createdAt: 2 },
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
      { id: '1', title: 'Done', completed: true, category: 'work', priority: 'low', dueDate: null, createdAt: 1 },
      { id: '2', title: 'Not done', completed: false, category: 'personal', priority: 'medium', dueDate: null, createdAt: 2 },
      { id: '3', title: 'Also done', completed: true, category: 'health', priority: 'high', dueDate: null, createdAt: 3 },
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
      { id: '1', title: 'Saved', completed: false, category: 'work', priority: 'medium', dueDate: null, createdAt: 1 },
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
});
