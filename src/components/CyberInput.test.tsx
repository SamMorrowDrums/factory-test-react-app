import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CyberInput } from './CyberInput';

describe('CyberInput', () => {
  it('renders a text input', () => {
    render(<CyberInput aria-label="Test input" />);
    const input = screen.getByLabelText('Test input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('applies cyber-input class', () => {
    render(<CyberInput aria-label="Test input" />);
    const input = screen.getByLabelText('Test input');
    expect(input).toHaveClass('cyber-input');
  });

  it('shows placeholder text', () => {
    render(<CyberInput placeholder="Enter text…" />);
    expect(screen.getByPlaceholderText('Enter text…')).toBeInTheDocument();
  });

  it('handles value and onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CyberInput aria-label="Test input" value="" onChange={onChange} />);
    await user.type(screen.getByLabelText('Test input'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('appends additional className', () => {
    render(<CyberInput aria-label="Test input" className="extra" />);
    const input = screen.getByLabelText('Test input');
    expect(input).toHaveClass('cyber-input', 'extra');
  });
});
