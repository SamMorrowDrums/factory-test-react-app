import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CyberCheckbox } from './CyberCheckbox';

describe('CyberCheckbox', () => {
  it('renders an unchecked checkbox', () => {
    render(<CyberCheckbox checked={false} onChange={() => {}} aria-label="Test checkbox" />);
    const input = screen.getByLabelText('Test checkbox');
    expect(input).not.toBeChecked();
  });

  it('renders a checked checkbox', () => {
    render(<CyberCheckbox checked={true} onChange={() => {}} aria-label="Test checkbox" />);
    const input = screen.getByLabelText('Test checkbox');
    expect(input).toBeChecked();
  });

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CyberCheckbox checked={false} onChange={onChange} aria-label="Test checkbox" />);
    await user.click(screen.getByLabelText('Test checkbox'));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('renders the SVG checkmark', () => {
    const { container } = render(<CyberCheckbox checked={true} onChange={() => {}} />);
    expect(container.querySelector('.cyber-checkbox__check')).toBeInTheDocument();
  });

  it('has the cyber-checkbox class structure', () => {
    const { container } = render(<CyberCheckbox checked={false} onChange={() => {}} />);
    expect(container.querySelector('.cyber-checkbox')).toBeInTheDocument();
    expect(container.querySelector('.cyber-checkbox__box')).toBeInTheDocument();
    expect(container.querySelector('.cyber-checkbox__input')).toBeInTheDocument();
  });
});
