import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from './TodoInput';

describe('TodoInput', () => {
  it('renders a text input, category select, and add button', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    expect(screen.getByLabelText('Todo title')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
  });

  it('renders all category options', () => {
    render(<TodoInput onAdd={vi.fn()} />);
    const select = screen.getByLabelText('Category');
    const options = select.querySelectorAll('option');
    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent('Work');
    expect(options[1]).toHaveTextContent('Personal');
    expect(options[2]).toHaveTextContent('Shopping');
    expect(options[3]).toHaveTextContent('Health');
  });

  it('calls onAdd with title and category on submit', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), 'Buy milk');
    await userEvent.selectOptions(screen.getByLabelText('Category'), 'shopping');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('Buy milk', 'shopping');
  });

  it('clears the input after submission', async () => {
    render(<TodoInput onAdd={vi.fn()} />);
    const input = screen.getByLabelText('Todo title') as HTMLInputElement;

    await userEvent.type(input, 'Buy milk');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(input.value).toBe('');
  });

  it('does not call onAdd when title is empty', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('does not call onAdd when title is only whitespace', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), '   ');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('trims whitespace from the title before calling onAdd', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), '  Buy milk  ');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledWith('Buy milk', 'personal');
  });

  it('submits on Enter key press', async () => {
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    await userEvent.type(screen.getByLabelText('Todo title'), 'Go jogging{enter}');

    expect(onAdd).toHaveBeenCalledWith('Go jogging', 'personal');
  });
});
