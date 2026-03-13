import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types/todo';

const baseTodo: Todo = {
  id: 'todo-1',
  title: 'Buy groceries',
  completed: false,
  category: 'shopping',
  createdAt: Date.now(),
};

describe('TodoItem', () => {
  it('renders the todo title', () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('renders a checkbox reflecting completed state', () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('renders the checkbox as checked when todo is completed', () => {
    const completed = { ...baseTodo, completed: true };
    render(<TodoItem todo={completed} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('applies strikethrough class when completed', () => {
    const completed = { ...baseTodo, completed: true };
    const { container } = render(
      <TodoItem todo={completed} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    expect(container.querySelector('.todo-item--completed')).toBeInTheDocument();
  });

  it('does not apply completed class when active', () => {
    const { container } = render(
      <TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    expect(container.querySelector('.todo-item--completed')).not.toBeInTheDocument();
  });

  it('renders the category badge', () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    const badge = screen.getByText('shopping');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('todo-item__category--shopping');
  });

  it('renders a delete button', () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onToggle with the todo id when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    render(<TodoItem todo={baseTodo} onToggle={onToggle} onDelete={vi.fn()} />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith('todo-1');
  });

  it('calls onDelete with the todo id when delete button is clicked', async () => {
    const onDelete = vi.fn();
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={onDelete} />);

    await userEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('todo-1');
  });
});
