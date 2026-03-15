import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CyberToggle } from './CyberToggle';

describe('CyberToggle', () => {
  it('renders with checkbox role', () => {
    render(<CyberToggle checked={false} onChange={() => {}} aria-label="Test toggle" />);
    expect(screen.getByRole('checkbox', { name: 'Test toggle' })).toBeInTheDocument();
  });

  it('reflects checked state via aria-checked', () => {
    render(<CyberToggle checked={true} onChange={() => {}} aria-label="Toggle" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('reflects unchecked state via aria-checked', () => {
    render(<CyberToggle checked={false} onChange={() => {}} aria-label="Toggle" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onChange when clicked', async () => {
    const onChange = vi.fn();
    render(<CyberToggle checked={false} onChange={onChange} aria-label="Toggle" />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when Space is pressed', async () => {
    const onChange = vi.fn();
    render(<CyberToggle checked={false} onChange={onChange} aria-label="Toggle" />);
    screen.getByRole('checkbox').focus();
    await userEvent.keyboard(' ');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when Enter is pressed', async () => {
    const onChange = vi.fn();
    render(<CyberToggle checked={false} onChange={onChange} aria-label="Toggle" />);
    screen.getByRole('checkbox').focus();
    await userEvent.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('applies the on modifier class when checked', () => {
    const { container } = render(<CyberToggle checked={true} onChange={() => {}} />);
    expect(container.querySelector('.cyber-toggle')).toHaveClass('cyber-toggle--on');
  });

  it('does not apply on class when unchecked', () => {
    const { container } = render(<CyberToggle checked={false} onChange={() => {}} />);
    expect(container.querySelector('.cyber-toggle')).not.toHaveClass('cyber-toggle--on');
  });

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn();
    render(<CyberToggle checked={false} onChange={onChange} aria-label="Toggle" disabled />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('sets aria-disabled when disabled', () => {
    render(<CyberToggle checked={false} onChange={() => {}} aria-label="Toggle" disabled />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-disabled', 'true');
  });
});
