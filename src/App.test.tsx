import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import type { Todo } from './types/todo';

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: crypto.randomUUID(),
  title: 'Test todo',
  completed: false,
  category: 'work',
  createdAt: Date.now(),
  ...overrides,
});

const defaultTodos: Todo[] = [
  makeTodo({ id: '1', title: 'Buy groceries', completed: false, category: 'shopping' }),
  makeTodo({ id: '2', title: 'Finish report', completed: true, category: 'work' }),
];

let mockReturnValue: {
  todos: Todo[];
  addTodo: ReturnType<typeof vi.fn>;
  toggleTodo: ReturnType<typeof vi.fn>;
  deleteTodo: ReturnType<typeof vi.fn>;
  clearCompleted: ReturnType<typeof vi.fn>;
};

vi.mock('./hooks/useTodos', () => ({
  useTodos: () => mockReturnValue,
}));

describe('App', () => {
  beforeEach(() => {
    mockReturnValue = {
      todos: defaultTodos,
      addTodo: vi.fn(),
      toggleTodo: vi.fn(),
      deleteTodo: vi.fn(),
      clearCompleted: vi.fn(),
    };
  });

  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'GLITCH_DO' })).toBeInTheDocument();
  });

  it('renders TodoInput and TodoList', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Add a new todo…')).toBeInTheDocument();
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Finish report')).toBeInTheDocument();
  });

  it('calls addTodo when a new todo is submitted', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Add a new todo…');
    await userEvent.type(input, 'New task');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(mockReturnValue.addTodo).toHaveBeenCalledWith('New task', 'work');
  });
});
