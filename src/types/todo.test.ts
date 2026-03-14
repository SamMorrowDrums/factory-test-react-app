import { describe, it, expect, vi } from 'vitest';
import { createTodo } from './todo';
import type { Todo, TodoCategory } from './todo';

describe('createTodo', () => {
  it('creates a todo with the given title and category', () => {
    const todo = createTodo('Buy groceries', 'shopping');

    expect(todo.title).toBe('Buy groceries');
    expect(todo.category).toBe('shopping');
    expect(todo.completed).toBe(false);
    expect(todo.priority).toBe('medium');
  });

  it('generates a unique id', () => {
    const todo1 = createTodo('Task 1', 'work');
    const todo2 = createTodo('Task 2', 'work');

    expect(todo1.id).toBeTruthy();
    expect(todo2.id).toBeTruthy();
    expect(todo1.id).not.toBe(todo2.id);
  });

  it('sets createdAt to the current timestamp', () => {
    const now = 1700000000000;
    vi.spyOn(Date, 'now').mockReturnValue(now);

    const todo = createTodo('Test', 'personal');

    expect(todo.createdAt).toBe(now);

    vi.restoreAllMocks();
  });

  it('satisfies the Todo interface', () => {
    const todo: Todo = createTodo('Health check', 'health');

    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('title');
    expect(todo).toHaveProperty('completed');
    expect(todo).toHaveProperty('category');
    expect(todo).toHaveProperty('priority');
    expect(todo).toHaveProperty('createdAt');
  });

  it('uses default priority of medium', () => {
    const todo = createTodo('Test', 'work');
    expect(todo.priority).toBe('medium');
  });

  it('accepts a custom priority', () => {
    const todo = createTodo('Urgent task', 'work', 'high');
    expect(todo.priority).toBe('high');
  });

  it('accepts an optional due date', () => {
    const dueDate = 1700100000000;
    const todo = createTodo('Task with deadline', 'work', 'high', dueDate);
    expect(todo.dueDate).toBe(dueDate);
  });

  it('omits dueDate when not provided', () => {
    const todo = createTodo('No deadline', 'work');
    expect(todo.dueDate).toBeUndefined();
  });
});

describe('TodoCategory', () => {
  it('accepts valid category values', () => {
    const categories: TodoCategory[] = ['work', 'personal', 'shopping', 'health'];
    categories.forEach((cat) => {
      const todo = createTodo('test', cat);
      expect(todo.category).toBe(cat);
    });
  });
});
