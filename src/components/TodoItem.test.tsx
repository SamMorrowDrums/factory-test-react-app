import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types/todo';

const makeTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: 'test-1',
  title: 'Buy groceries',
  completed: false,
  category: 'shopping',
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
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('test-1');
    });
  });

  it('renders different category badges correctly', () => {
    render(
      <TodoItem {...defaultProps} todo={makeTodo({ category: 'work' })} />
    );
    const badge = screen.getByText('work');
    expect(badge).toHaveClass('todo-item__category--work');
  });

  it('renders a drag handle', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByLabelText('Drag to reorder')).toBeInTheDocument();
  });

  it('has draggable attribute', () => {
    render(<TodoItem {...defaultProps} />);
    const item = screen.getByRole('listitem');
    expect(item).toHaveAttribute('draggable', 'true');
  });

  it('applies dragging class when isDragging is true', () => {
    const { container } = render(<TodoItem {...defaultProps} isDragging />);
    const li = container.querySelector('.todo-item');
    expect(li).toHaveClass('todo-item--dragging');
  });

  it('applies drag-over class when isDragOver is true', () => {
    const { container } = render(<TodoItem {...defaultProps} isDragOver />);
    const li = container.querySelector('.todo-item');
    expect(li).toHaveClass('todo-item--drag-over');
  });
});
