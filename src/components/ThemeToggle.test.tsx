import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders sun icon in cyberpunk mode', () => {
    render(<ThemeToggle theme="cyberpunk" onToggle={vi.fn()} />);
    expect(screen.getByRole('button', { name: /switch to clean theme/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('☀️');
  });

  it('renders moon icon in clean mode', () => {
    render(<ThemeToggle theme="clean" onToggle={vi.fn()} />);
    expect(screen.getByRole('button', { name: /switch to cyberpunk theme/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('🌙');
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="cyberpunk" onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
