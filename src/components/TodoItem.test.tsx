import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types/todo';

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 'test-1',
  title: 'Buy groceries',
  completed: false,
  category: 'shopping',
  priority: 'medium',
  dueDate: null,
  createdAt: Date.now(),
  ...overrides,
});

describe('TodoItem', () => {
  const defaultProps = {
    todo: makeTodo(),
    onToggle: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders the todo title', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('renders a checkbox reflecting completed state', () => {
    render(<TodoItem {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders a checked checkbox when todo is completed', () => {
    render(<TodoItem {...defaultProps} todo={makeTodo({ completed: true })} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('applies strikethrough styling when completed', () => {
    const { container } = render(
      <TodoItem {...defaultProps} todo={makeTodo({ completed: true })} />
    );
    const li = container.querySelector('.todo-item');
    expect(li).toHaveClass('todo-item--completed');
  });

  it('does not apply strikethrough styling when active', () => {
    const { container } = render(<TodoItem {...defaultProps} />);
    const li = container.querySelector('.todo-item');
    expect(li).not.toHaveClass('todo-item--completed');
  });

  it('renders the category badge', () => {
    render(<TodoItem {...defaultProps} />);
    const badge = screen.getByText('shopping');
    expect(badge).toHaveClass('todo-item__category');
    expect(badge).toHaveClass('todo-item__category--shopping');
  });

  it('renders the priority badge', () => {
    render(<TodoItem {...defaultProps} todo={makeTodo({ priority: 'high' })} />);
    const badge = screen.getByText('high');
    expect(badge).toHaveClass('todo-item__priority');
    expect(badge).toHaveClass('todo-item__priority--high');
  });

  it('renders different priority badges correctly', () => {
    const { rerender } = render(<TodoItem {...defaultProps} todo={makeTodo({ priority: 'low' })} />);
    expect(screen.getByText('low')).toHaveClass('todo-item__priority--low');

    rerender(<TodoItem {...defaultProps} todo={makeTodo({ priority: 'medium' })} />);
    expect(screen.getByText('medium')).toHaveClass('todo-item__priority--medium');
  });

  it('renders a delete button', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onToggle with todo id when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    render(<TodoItem {...defaultProps} onToggle={onToggle} />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('test-1');
  });

  it('calls onDelete with todo id when delete button is clicked', async () => {
    const onDelete = vi.fn();
    render(<TodoItem {...defaultProps} onDelete={onDelete} />);

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('test-1');
  });

  it('renders different category badges correctly', () => {
    render(
      <TodoItem {...defaultProps} todo={makeTodo({ category: 'work' })} />
    );
    const badge = screen.getByText('work');
    expect(badge).toHaveClass('todo-item__category--work');
  });

  it('does not render due date when null', () => {
    const { container } = render(<TodoItem {...defaultProps} />);
    expect(container.querySelector('.todo-item__due-date')).not.toBeInTheDocument();
  });

  it('renders due date when set', () => {
    const dueDate = new Date('2026-12-31').getTime();
    render(<TodoItem {...defaultProps} todo={makeTodo({ dueDate })} />);
    expect(screen.getByText(/Dec 31, 2026/)).toBeInTheDocument();
  });

  it('applies overdue styling for past due dates on active todos', () => {
    const pastDate = new Date('2020-01-01').getTime();
    const { container } = render(
      <TodoItem {...defaultProps} todo={makeTodo({ dueDate: pastDate })} />
    );
    const li = container.querySelector('.todo-item');
    expect(li).toHaveClass('todo-item--overdue');
    const dueDateEl = container.querySelector('.todo-item__due-date');
    expect(dueDateEl).toHaveClass('todo-item__due-date--overdue');
  });

  it('does not apply overdue styling for completed todos', () => {
    const pastDate = new Date('2020-01-01').getTime();
    const { container } = render(
      <TodoItem {...defaultProps} todo={makeTodo({ dueDate: pastDate, completed: true })} />
    );
    const li = container.querySelector('.todo-item');
    expect(li).not.toHaveClass('todo-item--overdue');
  });
});
