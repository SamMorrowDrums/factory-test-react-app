import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CyberButton } from './CyberButton';

describe('CyberButton', () => {
  it('renders children text', () => {
    render(<CyberButton>Click me</CyberButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies ghost variant by default', () => {
    render(<CyberButton>Test</CyberButton>);
    const btn = screen.getByText('Test');
    expect(btn).toHaveClass('cyber-btn', 'cyber-btn--ghost');
  });

  it('applies primary variant', () => {
    render(<CyberButton variant="primary">Test</CyberButton>);
    const btn = screen.getByText('Test');
    expect(btn).toHaveClass('cyber-btn--primary');
  });

  it('applies danger variant', () => {
    render(<CyberButton variant="danger">Test</CyberButton>);
    const btn = screen.getByText('Test');
    expect(btn).toHaveClass('cyber-btn--danger');
  });

  it('applies active class when active', () => {
    render(<CyberButton active>Test</CyberButton>);
    const btn = screen.getByText('Test');
    expect(btn).toHaveClass('cyber-btn--active');
  });

  it('does not apply active class when not active', () => {
    render(<CyberButton>Test</CyberButton>);
    const btn = screen.getByText('Test');
    expect(btn).not.toHaveClass('cyber-btn--active');
  });

  it('applies sm size class', () => {
    render(<CyberButton size="sm">Test</CyberButton>);
    const btn = screen.getByText('Test');
    expect(btn).toHaveClass('cyber-btn--sm');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CyberButton onClick={onClick}>Test</CyberButton>);
    await user.click(screen.getByText('Test'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('can be disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<CyberButton disabled onClick={onClick}>Test</CyberButton>);
    const btn = screen.getByText('Test');
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('passes through additional HTML attributes', () => {
    render(<CyberButton aria-label="Custom label">Test</CyberButton>);
    expect(screen.getByLabelText('Custom label')).toBeInTheDocument();
  });
});
