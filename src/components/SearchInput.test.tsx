import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders search input with placeholder', () => {
    render(<SearchInput query="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search todos…')).toBeInTheDocument();
  });

  it('renders with the provided query value', () => {
    render(<SearchInput query="hello" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Search todos')).toHaveValue('hello');
  });

  it('calls onChange when user types', async () => {
    const onChange = vi.fn();
    render(<SearchInput query="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Search todos'), 'a');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('shows clear button when query is non-empty', () => {
    render(<SearchInput query="hello" onChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('hides clear button when query is empty', () => {
    render(<SearchInput query="" onChange={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('calls onChange with empty string when clear is clicked', async () => {
    const onChange = vi.fn();
    render(<SearchInput query="hello" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('has type="search" on input', () => {
    render(<SearchInput query="" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Search todos')).toHaveAttribute('type', 'search');
  });
});
