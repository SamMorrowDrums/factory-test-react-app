import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HighlightText } from './HighlightText';

describe('HighlightText', () => {
  it('renders text without highlighting when query is empty', () => {
    render(<HighlightText text="Buy groceries" query="" />);
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.queryByRole('mark')).not.toBeInTheDocument();
  });

  it('renders text without highlighting when query is whitespace', () => {
    render(<HighlightText text="Buy groceries" query="   " />);
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.queryByRole('mark')).not.toBeInTheDocument();
  });

  it('highlights matching text case-insensitively', () => {
    const { container } = render(<HighlightText text="Buy groceries" query="buy" />);
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent('Buy');
    expect(marks[0]).toHaveClass('highlight');
  });

  it('highlights multiple occurrences', () => {
    const { container } = render(<HighlightText text="go to the go-kart" query="go" />);
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(2);
  });

  it('renders full text when query does not match', () => {
    render(<HighlightText text="Buy groceries" query="xyz" />);
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(document.querySelector('mark')).not.toBeInTheDocument();
  });

  it('escapes special regex characters in query', () => {
    const { container } = render(<HighlightText text="price is $5.00" query="$5.00" />);
    const marks = container.querySelectorAll('mark');
    expect(marks).toHaveLength(1);
    expect(marks[0]).toHaveTextContent('$5.00');
  });

  it('preserves original casing in highlighted text', () => {
    const { container } = render(<HighlightText text="Hello World" query="hello" />);
    const mark = container.querySelector('mark');
    expect(mark).toHaveTextContent('Hello');
  });
});
