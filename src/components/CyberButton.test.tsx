import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CyberButton } from './CyberButton';

describe('CyberButton', () => {
  it('renders children', () => {
    render(<CyberButton>Click Me</CyberButton>);
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('applies secondary variant by default', () => {
    const { container } = render(<CyberButton>Btn</CyberButton>);
    expect(container.querySelector('.cyber-btn')).toHaveClass('cyber-btn--secondary');
  });

  it('applies primary variant class', () => {
    const { container } = render(<CyberButton variant="primary">Btn</CyberButton>);
    expect(container.querySelector('.cyber-btn')).toHaveClass('cyber-btn--primary');
  });

  it('applies danger variant class', () => {
    const { container } = render(<CyberButton variant="danger">Btn</CyberButton>);
    expect(container.querySelector('.cyber-btn')).toHaveClass('cyber-btn--danger');
  });

  it('applies size classes', () => {
    const { container } = render(<CyberButton size="sm">Btn</CyberButton>);
    expect(container.querySelector('.cyber-btn')).toHaveClass('cyber-btn--sm');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<CyberButton onClick={onClick}>Btn</CyberButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const onClick = vi.fn();
    render(<CyberButton onClick={onClick} disabled>Btn</CyberButton>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies disabled class and attribute', () => {
    const { container } = render(<CyberButton disabled>Btn</CyberButton>);
    const btn = container.querySelector('.cyber-btn');
    expect(btn).toHaveClass('cyber-btn--disabled');
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('merges additional className', () => {
    const { container } = render(<CyberButton className="extra">Btn</CyberButton>);
    expect(container.querySelector('.cyber-btn')).toHaveClass('extra');
  });

  it('passes through extra button attributes', () => {
    render(<CyberButton type="submit" aria-label="Submit form">Btn</CyberButton>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveAttribute('aria-label', 'Submit form');
  });
});
