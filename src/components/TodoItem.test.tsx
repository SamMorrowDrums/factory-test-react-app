import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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
    expect(onDelete).toHaveBeenCalledWith('test-1');
  });

  it('renders different category badges correctly', () => {
    render(
      <TodoItem {...defaultProps} todo={makeTodo({ category: 'work' })} />
    );
    const badge = screen.getByText('work');
    expect(badge).toHaveClass('todo-item__category--work');
  });

  it('renders an add sub-task button when onAddSubTask is provided', () => {
    render(
      <TodoItem {...defaultProps} onAddSubTask={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: /add sub-task/i })).toBeInTheDocument();
  });

  it('does not show add sub-task button for sub-tasks', () => {
    render(
      <TodoItem
        {...defaultProps}
        todo={makeTodo({ parentId: 'parent-1' })}
        onAddSubTask={vi.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: /add sub-task/i })).not.toBeInTheDocument();
  });

  it('shows sub-task input when add button is clicked', async () => {
    render(
      <TodoItem {...defaultProps} onAddSubTask={vi.fn()} />
    );

    await userEvent.click(screen.getByRole('button', { name: /add sub-task/i }));
    expect(screen.getByLabelText('Sub-task title')).toBeInTheDocument();
  });

  it('calls onAddSubTask when sub-task form is submitted', async () => {
    const onAddSubTask = vi.fn();
    render(
      <TodoItem {...defaultProps} onAddSubTask={onAddSubTask} />
    );

    await userEvent.click(screen.getByRole('button', { name: /add sub-task/i }));
    await userEvent.type(screen.getByLabelText('Sub-task title'), 'New sub-task');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAddSubTask).toHaveBeenCalledWith('New sub-task', 'test-1');
  });

  it('renders sub-tasks when provided', () => {
    const subTasks: Todo[] = [
      makeTodo({ id: 'sub-1', title: 'Sub item 1', parentId: 'test-1' }),
      makeTodo({ id: 'sub-2', title: 'Sub item 2', parentId: 'test-1' }),
    ];

    render(
      <TodoItem {...defaultProps} subTasks={subTasks} />
    );

    expect(screen.getByText('Sub item 1')).toBeInTheDocument();
    expect(screen.getByText('Sub item 2')).toBeInTheDocument();
  });

  it('renders sub-tasks in a nested list', () => {
    const subTasks: Todo[] = [
      makeTodo({ id: 'sub-1', title: 'Sub item', parentId: 'test-1' }),
    ];

    render(
      <TodoItem {...defaultProps} subTasks={subTasks} />
    );

    const subList = screen.getByRole('list', { name: /sub-tasks of/i });
    expect(subList).toBeInTheDocument();
    expect(within(subList).getByText('Sub item')).toBeInTheDocument();
  });

  it('applies subtask styling to child todos', () => {
    const { container } = render(
      <TodoItem
        {...defaultProps}
        todo={makeTodo({ parentId: 'parent-1' })}
      />
    );
    const li = container.querySelector('.todo-item');
    expect(li).toHaveClass('todo-item--subtask');
  });
});
