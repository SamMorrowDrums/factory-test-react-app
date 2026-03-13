import { describe, it, expect } from 'vitest';
import { createTodo, type Todo, type TodoCategory } from './todo';

describe('Todo types', () => {
  it('createTodo returns a valid Todo', () => {
    const todo = createTodo('Buy milk', 'shopping');

    expect(todo.title).toBe('Buy milk');
    expect(todo.category).toBe('shopping');
    expect(todo.completed).toBe(false);
    expect(todo.id).toBeDefined();
    expect(typeof todo.id).toBe('string');
    expect(todo.id.length).toBeGreaterThan(0);
    expect(typeof todo.createdAt).toBe('number');
    expect(todo.createdAt).toBeLessThanOrEqual(Date.now());
  });

  it('createTodo generates unique ids', () => {
    const a = createTodo('Task A', 'work');
    const b = createTodo('Task B', 'personal');

    expect(a.id).not.toBe(b.id);
  });

  it('createTodo accepts all valid categories', () => {
    const categories: TodoCategory[] = ['work', 'personal', 'shopping', 'health'];

    for (const category of categories) {
      const todo = createTodo('Test', category);
      expect(todo.category).toBe(category);
    }
  });

  it('Todo interface shape is correct', () => {
    const todo: Todo = {
      id: 'test-id',
      title: 'Test',
      completed: true,
      category: 'work',
      createdAt: 1234567890,
    };

    expect(todo).toEqual({
      id: 'test-id',
      title: 'Test',
      completed: true,
      category: 'work',
      createdAt: 1234567890,
    });
  });
});
