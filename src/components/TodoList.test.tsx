import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from './TodoList';
import type { Todo } from '../types/todo';

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: crypto.randomUUID(),
  title: 'Test todo',
  completed: false,
  category: 'work',
  tags: [],
  createdAt: Date.now(),
  ...overrides,
});

const defaultTodos: Todo[] = [
  makeTodo({ id: '1', title: 'Active work', completed: false, category: 'work' }),
  makeTodo({ id: '2', title: 'Done shopping', completed: true, category: 'shopping' }),
  makeTodo({ id: '3', title: 'Active personal', completed: false, category: 'personal' }),
];

let mockReturnValue: ReturnType<typeof createMockReturn>;

function createMockReturn(todos: Todo[] = defaultTodos, overrides: Record<string, unknown> = {}) {
  return {
    todos,
    addTodo: vi.fn(),
    toggleTodo: vi.fn(),
    deleteTodo: vi.fn(),
    addTag: vi.fn(),
    removeTag: vi.fn(),
    clearCompleted: vi.fn(),
    ...overrides,
  };
}

vi.mock('../hooks/useTodos', () => ({
  useTodos: () => mockReturnValue,
}));

describe('TodoList', () => {
  beforeEach(() => {
    mockReturnValue = createMockReturn();
  });

  it('renders all todos by default', () => {
    render(<TodoList />);
    expect(screen.getByText('Active work')).toBeInTheDocument();
    expect(screen.getByText('Done shopping')).toBeInTheDocument();
    expect(screen.getByText('Active personal')).toBeInTheDocument();
  });

  it('renders the TodoFilter component', () => {
    render(<TodoList />);
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Completed' })).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by category')).toBeInTheDocument();
  });

  it('shows the count of remaining active items', () => {
    render(<TodoList />);
    expect(screen.getByText('2 items left')).toBeInTheDocument();
  });

  it('shows singular "item" when only one active item remains', () => {
    mockReturnValue = createMockReturn([
      makeTodo({ id: '1', title: 'Only one', completed: false }),
      makeTodo({ id: '2', title: 'Done', completed: true }),
    ]);

    render(<TodoList />);
    expect(screen.getByText('1 item left')).toBeInTheDocument();
  });

  it('shows "Clear completed" button when there are completed items', () => {
    render(<TodoList />);
    expect(screen.getByRole('button', { name: 'Clear completed' })).toBeInTheDocument();
  });

  it('hides "Clear completed" button when no completed items exist', () => {
    mockReturnValue = createMockReturn([
      makeTodo({ id: '1', title: 'Task A', completed: false }),
      makeTodo({ id: '2', title: 'Task B', completed: false }),
    ]);

    render(<TodoList />);
    expect(screen.queryByRole('button', { name: 'Clear completed' })).not.toBeInTheDocument();
  });

  it('filters to show only active todos', async () => {
    render(<TodoList />);
    await userEvent.click(screen.getByRole('button', { name: 'Active' }));

    expect(screen.getByText('Active work')).toBeInTheDocument();
    expect(screen.getByText('Active personal')).toBeInTheDocument();
    expect(screen.queryByText('Done shopping')).not.toBeInTheDocument();
  });

  it('filters to show only completed todos', async () => {
    render(<TodoList />);
    await userEvent.click(screen.getByRole('button', { name: 'Completed' }));

    expect(screen.getByText('Done shopping')).toBeInTheDocument();
    expect(screen.queryByText('Active work')).not.toBeInTheDocument();
    expect(screen.queryByText('Active personal')).not.toBeInTheDocument();
  });

  it('filters by category', async () => {
    render(<TodoList />);
    const categorySelect = screen.getByLabelText('Filter by category');
    await userEvent.selectOptions(categorySelect, 'shopping');

    expect(screen.getByText('Done shopping')).toBeInTheDocument();
    expect(screen.queryByText('Active work')).not.toBeInTheDocument();
    expect(screen.queryByText('Active personal')).not.toBeInTheDocument();
  });

  it('combines status and category filters', async () => {
    render(<TodoList />);

    await userEvent.click(screen.getByRole('button', { name: 'Active' }));
    const categorySelect = screen.getByLabelText('Filter by category');
    await userEvent.selectOptions(categorySelect, 'work');

    expect(screen.getByText('Active work')).toBeInTheDocument();
    expect(screen.queryByText('Active personal')).not.toBeInTheDocument();
    expect(screen.queryByText('Done shopping')).not.toBeInTheDocument();
  });

  it('renders todo items in a list', () => {
    render(<TodoList />);
    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('calls clearCompleted when "Clear completed" button is clicked', async () => {
    const clearCompleted = vi.fn();
    mockReturnValue = createMockReturn(defaultTodos, { clearCompleted });

    render(<TodoList />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear completed' }));
    expect(clearCompleted).toHaveBeenCalledOnce();
  });

  it('filters by tag', async () => {
    const taggedTodos: Todo[] = [
      makeTodo({ id: '1', title: 'Tagged urgent', tags: ['urgent'] }),
      makeTodo({ id: '2', title: 'Tagged bug', tags: ['bug'] }),
      makeTodo({ id: '3', title: 'No tags', tags: [] }),
    ];
    mockReturnValue = createMockReturn(taggedTodos);

    render(<TodoList />);
    const tagSelect = screen.getByLabelText('Filter by tag');
    await userEvent.selectOptions(tagSelect, 'urgent');

    expect(screen.getByText('Tagged urgent')).toBeInTheDocument();
    expect(screen.queryByText('Tagged bug')).not.toBeInTheDocument();
    expect(screen.queryByText('No tags')).not.toBeInTheDocument();
  });

  it('renders tag filter dropdown when todos have tags', () => {
    const taggedTodos: Todo[] = [
      makeTodo({ id: '1', title: 'Tagged', tags: ['urgent'] }),
    ];
    mockReturnValue = createMockReturn(taggedTodos);

    render(<TodoList />);
    expect(screen.getByLabelText('Filter by tag')).toBeInTheDocument();
  });

  it('hides tag filter dropdown when no todos have tags', () => {
    const noTagTodos: Todo[] = [
      makeTodo({ id: '1', title: 'No tags', tags: [] }),
    ];
    mockReturnValue = createMockReturn(noTagTodos);

    render(<TodoList />);
    expect(screen.queryByLabelText('Filter by tag')).not.toBeInTheDocument();
  });
});
