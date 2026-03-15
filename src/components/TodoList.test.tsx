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
    addSubTodo: vi.fn(),
    toggleTodo: vi.fn(),
    deleteTodo: vi.fn(),
    clearCompleted: vi.fn(),
    reorderTodos: vi.fn(),
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

  it('renders the search bar', () => {
    render(<TodoList />);
    expect(screen.getByLabelText('Search todos')).toBeInTheDocument();
  });

  it('filters todos by search query', async () => {
    render(<TodoList />);
    const searchInput = screen.getByLabelText('Search todos');
    await userEvent.type(searchInput, 'work');

    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Active work');
  });

  it('search is case-insensitive', async () => {
    render(<TodoList />);
    const searchInput = screen.getByLabelText('Search todos');
    await userEvent.type(searchInput, 'ACTIVE');

    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Active work');
    expect(items[1]).toHaveTextContent('Active personal');
  });

  it('combines search with status and category filters', async () => {
    render(<TodoList />);
    await userEvent.click(screen.getByRole('button', { name: 'Active' }));
    const searchInput = screen.getByLabelText('Search todos');
    await userEvent.type(searchInput, 'personal');

    const list = screen.getByRole('list');
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveTextContent('Active personal');
  });

  it('shows no items when search matches nothing', async () => {
    render(<TodoList />);
    const searchInput = screen.getByLabelText('Search todos');
    await userEvent.type(searchInput, 'zzzzz');

    const list = screen.getByRole('list');
    const items = within(list).queryAllByRole('listitem');
    expect(items).toHaveLength(0);
  });

  it('renders sub-tasks nested under their parent', () => {
    const todosWithChildren: Todo[] = [
      makeTodo({ id: '1', title: 'Parent task', completed: false, category: 'work' }),
      makeTodo({ id: '2', title: 'Sub-task A', completed: false, category: 'work', parentId: '1' }),
      makeTodo({ id: '3', title: 'Sub-task B', completed: false, category: 'work', parentId: '1' }),
    ];
    mockReturnValue = createMockReturn(todosWithChildren);

    render(<TodoList />);
    expect(screen.getByText('Parent task')).toBeInTheDocument();
    expect(screen.getByText('Sub-task A')).toBeInTheDocument();
    expect(screen.getByText('Sub-task B')).toBeInTheDocument();
  });

  it('only counts top-level active todos in footer', () => {
    const todosWithChildren: Todo[] = [
      makeTodo({ id: '1', title: 'Parent', completed: false, category: 'work' }),
      makeTodo({ id: '2', title: 'Sub-task', completed: false, category: 'work', parentId: '1' }),
    ];
    mockReturnValue = createMockReturn(todosWithChildren);

    render(<TodoList />);
    expect(screen.getByText('1 item left')).toBeInTheDocument();
  });

  it('does not show sub-tasks as top-level items', () => {
    const todosWithChildren: Todo[] = [
      makeTodo({ id: '1', title: 'Parent task', completed: false, category: 'work' }),
      makeTodo({ id: '2', title: 'Sub-task only', completed: false, category: 'work', parentId: '1' }),
    ];
    mockReturnValue = createMockReturn(todosWithChildren);

    const { container } = render(<TodoList />);
    expect(screen.getByText('Parent task')).toBeInTheDocument();
    expect(screen.getByText('Sub-task only')).toBeInTheDocument();
    // The top-level list should only have 1 direct child item (the parent)
    const topLevelList = container.querySelector('.todo-list__items');
    const directChildren = topLevelList?.querySelectorAll(':scope > li');
    expect(directChildren?.length).toBe(1);
  });
});
