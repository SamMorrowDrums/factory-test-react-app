import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  const defaultProps = {
    query: '',
    onChange: vi.fn(),
  };

  it('renders a search input', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByLabelText('Search todos')).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search todos…')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const onChange = vi.fn();
    render(<SearchBar {...defaultProps} onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Search todos'), 'buy');
    expect(onChange).toHaveBeenCalledWith('b');
    expect(onChange).toHaveBeenCalledWith('u');
    expect(onChange).toHaveBeenCalledWith('y');
  });

  it('shows clear button when query is non-empty', () => {
    render(<SearchBar {...defaultProps} query="test" />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('hides clear button when query is empty', () => {
    render(<SearchBar {...defaultProps} query="" />);
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('calls onChange with empty string when clear is clicked', async () => {
    const onChange = vi.fn();
    render(<SearchBar {...defaultProps} query="test" onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('Clear search'));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('displays current query value', () => {
    render(<SearchBar {...defaultProps} query="hello" />);
    expect(screen.getByLabelText('Search todos')).toHaveValue('hello');
  });
});
