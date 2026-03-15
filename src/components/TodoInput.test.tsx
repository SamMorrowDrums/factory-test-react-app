import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from './TodoInput';

describe('TodoInput', () => {
  it('renders text input, category select, and add button', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    expect(screen.getByLabelText('Todo title')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo category')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Due date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('calls onAdd with title and category on submit', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), 'Buy milk');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('Buy milk', 'work', { notes: undefined, priority: 'medium', dueDate: undefined });
  });

  it('clears the input after submission', async () => {
    render(<TodoInput onAdd={vi.fn()} />);
    const input = screen.getByLabelText('Todo title') as HTMLInputElement;

    await userEvent.type(input, 'Buy milk');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(input.value).toBe('');
  });

  it('does not call onAdd when input is empty', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('does not call onAdd when input is only whitespace', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), '   ');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('allows selecting a different category', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), 'Go running');
    const categorySelect = screen.getByRole('combobox', { name: 'Todo category' });
    await userEvent.click(categorySelect);
    await userEvent.click(screen.getByRole('option', { name: /Health/i }));
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('Go running', 'health', { notes: undefined, priority: 'medium', dueDate: undefined });
  });

  it('renders all four category options', async () => {
    render(<TodoInput onAdd={vi.fn()} />);
    const select = screen.getByRole('combobox', { name: 'Todo category' });
    await userEvent.click(select);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('Work');
    expect(options[1]).toHaveTextContent('Personal');
    expect(options[2]).toHaveTextContent('Shopping');
    expect(options[3]).toHaveTextContent('Health');
  });

  it('renders a notes toggle button', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Toggle notes' })).toBeInTheDocument();
  });

  it('shows notes textarea when toggle is clicked', async () => {
    render(<TodoInput onAdd={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Toggle notes' }));
    expect(screen.getByLabelText('Todo notes')).toBeInTheDocument();
  });

  it('hides notes textarea when toggle is clicked again', async () => {
    render(<TodoInput onAdd={vi.fn()} />);
    const toggle = screen.getByRole('button', { name: 'Toggle notes' });
    await userEvent.click(toggle);
    expect(screen.getByLabelText('Todo notes')).toBeInTheDocument();
    await userEvent.click(toggle);
    expect(screen.queryByLabelText('Todo notes')).toBeNull();
  });

  it('calls onAdd with notes when provided', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), 'Task with notes');
    await userEvent.click(screen.getByRole('button', { name: 'Toggle notes' }));
    await userEvent.type(screen.getByLabelText('Todo notes'), 'Some details');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('Task with notes', 'work', { notes: 'Some details', priority: 'medium', dueDate: undefined });
  });

  it('clears notes and hides textarea after submission', async () => {
    render(<TodoInput onAdd={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Todo title'), 'Task');
    await userEvent.click(screen.getByRole('button', { name: 'Toggle notes' }));
    await userEvent.type(screen.getByLabelText('Todo notes'), 'Notes');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.queryByLabelText('Todo notes')).toBeNull();
  });

  it('trims whitespace from title before calling onAdd', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), '  Buy milk  ');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('Buy milk', 'work', { notes: undefined, priority: 'medium', dueDate: undefined });
  });
});
