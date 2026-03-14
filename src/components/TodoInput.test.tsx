import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from './TodoInput';

describe('TodoInput', () => {
  it('renders text input, category select, priority select, due date, and add button', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    expect(screen.getByLabelText('Todo title')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo category')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Due date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('calls onAdd with title, category, priority, and no due date on submit', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), 'Buy milk');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('Buy milk', 'work', 'medium', undefined);
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
    await userEvent.selectOptions(screen.getByLabelText('Todo category'), 'health');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('Go running', 'health', 'medium', undefined);
  });

  it('renders all four category options', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    const select = screen.getByLabelText('Todo category');
    const options = select.querySelectorAll('option');

    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('Work');
    expect(options[1]).toHaveTextContent('Personal');
    expect(options[2]).toHaveTextContent('Shopping');
    expect(options[3]).toHaveTextContent('Health');
  });

  it('trims whitespace from title before calling onAdd', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), '  Buy milk  ');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('Buy milk', 'work', 'medium', undefined);
  });

  it('renders all three priority options', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    const select = screen.getByLabelText('Todo priority');
    const options = select.querySelectorAll('option');

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('Low');
    expect(options[1]).toHaveTextContent('Medium');
    expect(options[2]).toHaveTextContent('High');
  });

  it('allows selecting a priority', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), 'Urgent task');
    await userEvent.selectOptions(screen.getByLabelText('Todo priority'), 'high');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('Urgent task', 'work', 'high', undefined);
  });
});
