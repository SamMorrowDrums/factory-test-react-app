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

  it('highlights matching text when searchQuery is provided', () => {
    render(<TodoItem {...defaultProps} searchQuery="groc" />);
    const highlight = screen.getByText('groc');
    expect(highlight.tagName).toBe('MARK');
    expect(highlight).toHaveClass('todo-item__highlight');
  });

  it('does not highlight when searchQuery is empty', () => {
    const { container } = render(<TodoItem {...defaultProps} searchQuery="" />);
    expect(container.querySelector('.todo-item__highlight')).toBeNull();
  });

  it('highlights case-insensitively', () => {
    render(<TodoItem {...defaultProps} searchQuery="BUY" />);
    const highlight = screen.getByText('Buy');
    expect(highlight.tagName).toBe('MARK');
  });

  it('renders an expand button', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Add notes' })).toBeInTheDocument();
  });

  it('shows expand arrow when todo has notes', () => {
    render(<TodoItem {...defaultProps} todo={makeTodo({ notes: 'Some note' })} />);
    expect(screen.getByRole('button', { name: 'Expand notes' })).toBeInTheDocument();
  });

  it('expands notes when expand button is clicked on todo with notes', async () => {
    render(<TodoItem {...defaultProps} todo={makeTodo({ notes: 'My detailed note' })} />);
    await userEvent.click(screen.getByRole('button', { name: 'Expand notes' }));
    expect(screen.getByText('My detailed note')).toBeInTheDocument();
  });

  it('collapses notes when expand button is clicked again', async () => {
    render(<TodoItem {...defaultProps} todo={makeTodo({ notes: 'My detailed note' })} />);
    await userEvent.click(screen.getByRole('button', { name: 'Expand notes' }));
    expect(screen.getByText('My detailed note')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Collapse notes' }));
    expect(screen.queryByText('My detailed note')).toBeNull();
  });

  it('opens notes editor when add notes button is clicked on todo without notes', async () => {
    render(<TodoItem {...defaultProps} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add notes' }));
    expect(screen.getByLabelText('Edit notes')).toBeInTheDocument();
  });

  it('calls onUpdateNotes when saving notes', async () => {
    const onUpdateNotes = vi.fn();
    render(<TodoItem {...defaultProps} onUpdateNotes={onUpdateNotes} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add notes' }));
    await userEvent.type(screen.getByLabelText('Edit notes'), 'New note');
    await userEvent.click(screen.getByRole('button', { name: 'Save notes' }));
    expect(onUpdateNotes).toHaveBeenCalledWith('test-1', 'New note');
  });

  it('cancels editing notes without saving', async () => {
    const onUpdateNotes = vi.fn();
    render(<TodoItem {...defaultProps} onUpdateNotes={onUpdateNotes} todo={makeTodo({ notes: 'Original' })} />);
    await userEvent.click(screen.getByRole('button', { name: 'Expand notes' }));
    await userEvent.click(screen.getByText('Original'));
    await userEvent.click(screen.getByRole('button', { name: 'Cancel editing' }));
    expect(onUpdateNotes).not.toHaveBeenCalled();
    expect(screen.getByText('Original')).toBeInTheDocument();
  });

  it('renders an add sub-task button when onAddSubTodo is provided', () => {
    render(<TodoItem {...defaultProps} onAddSubTodo={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Add sub-task' })).toBeInTheDocument();
  });

  it('does not render add sub-task button for nested items', () => {
    render(<TodoItem {...defaultProps} onAddSubTodo={vi.fn()} depth={1} />);
    expect(screen.queryByRole('button', { name: 'Add sub-task' })).not.toBeInTheDocument();
  });

  it('shows sub-task input form when add sub-task button is clicked', async () => {
    render(<TodoItem {...defaultProps} onAddSubTodo={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add sub-task' }));
    expect(screen.getByLabelText('Sub-task title')).toBeInTheDocument();
  });

  it('calls onAddSubTodo with parent id and title when sub-task form is submitted', async () => {
    const onAddSubTodo = vi.fn();
    render(<TodoItem {...defaultProps} onAddSubTodo={onAddSubTodo} />);
    await userEvent.click(screen.getByRole('button', { name: 'Add sub-task' }));
    await userEvent.type(screen.getByLabelText('Sub-task title'), 'My subtask');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onAddSubTodo).toHaveBeenCalledWith('test-1', 'My subtask', 'shopping');
  });

  it('renders sub-tasks when provided', () => {
    const subTasks = [
      makeTodo({ id: 'sub-1', title: 'Sub task 1', parentId: 'test-1' }),
      makeTodo({ id: 'sub-2', title: 'Sub task 2', parentId: 'test-1' }),
    ];
    render(<TodoItem {...defaultProps} subTasks={subTasks} />);
    expect(screen.getByText('Sub task 1')).toBeInTheDocument();
    expect(screen.getByText('Sub task 2')).toBeInTheDocument();
  });

  it('shows sub-task progress count', () => {
    const subTasks = [
      makeTodo({ id: 'sub-1', title: 'Sub 1', completed: true, parentId: 'test-1' }),
      makeTodo({ id: 'sub-2', title: 'Sub 2', completed: false, parentId: 'test-1' }),
      makeTodo({ id: 'sub-3', title: 'Sub 3', completed: true, parentId: 'test-1' }),
    ];
    render(<TodoItem {...defaultProps} subTasks={subTasks} />);
    expect(screen.getByText('2/3')).toBeInTheDocument();
  });

  it('does not render drag handle for nested items', () => {
    render(<TodoItem {...defaultProps} depth={1} />);
    expect(screen.queryByLabelText('Drag to reorder')).not.toBeInTheDocument();
  });

  it('is not draggable when nested', () => {
    render(<TodoItem {...defaultProps} depth={1} />);
    const item = screen.getByRole('listitem');
    expect(item).not.toHaveAttribute('draggable', 'true');
  });
});
