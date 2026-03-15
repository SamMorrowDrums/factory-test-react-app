import { describe, it, expect, vi } from 'vitest';
import { createTodo } from './todo';
import type { Todo, TodoCategory } from './todo';

describe('createTodo', () => {
  it('creates a todo with the given title and category', () => {
    const todo = createTodo('Buy groceries', 'shopping');

    expect(todo.title).toBe('Buy groceries');
    expect(todo.category).toBe('shopping');
    expect(todo.completed).toBe(false);
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

  it('creates a todo with notes when provided', () => {
    const todo = createTodo('Task', 'work', { notes: 'Some notes' });
    expect(todo.notes).toBe('Some notes');
  });

  it('creates a todo without notes when not provided', () => {
    const todo = createTodo('Task', 'work');
    expect(todo.notes).toBeUndefined();
  });

  it('omits notes property when notes is empty string', () => {
    const todo = createTodo('Task', 'work', { notes: '' });
    expect(todo.notes).toBeUndefined();
  });

  it('defaults priority to medium', () => {
    const todo = createTodo('Task', 'work');
    expect(todo.priority).toBe('medium');
  });

  it('accepts a custom priority', () => {
    const todo = createTodo('Task', 'work', { priority: 'high' });
    expect(todo.priority).toBe('high');
  });

  it('sets dueDate when provided', () => {
    const due = Date.now() + 86400000;
    const todo = createTodo('Task', 'work', { dueDate: due });
    expect(todo.dueDate).toBe(due);
  });

  it('leaves dueDate undefined when not provided', () => {
    const todo = createTodo('Task', 'work');
    expect(todo.dueDate).toBeUndefined();
  });

  it('accepts all options together', () => {
    const due = Date.now() + 86400000;
    const todo = createTodo('Task', 'work', { notes: 'Note', priority: 'low', dueDate: due });
    expect(todo.notes).toBe('Note');
    expect(todo.priority).toBe('low');
    expect(todo.dueDate).toBe(due);
  });

  it('sets parentId when provided', () => {
    const todo = createTodo('Sub-task', 'work', { parentId: 'parent-1' });
    expect(todo.parentId).toBe('parent-1');
  });

  it('leaves parentId undefined when not provided', () => {
    const todo = createTodo('Task', 'work');
    expect(todo.parentId).toBeUndefined();
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
